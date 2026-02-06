import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Prisma } from 'prisma/generated/prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { buildNutritionData } from 'src/recipes/helpers/create-recipe/build-nutrition-data'
import { buildStepsData } from 'src/recipes/helpers/create-recipe/build-steps-data'
import { buildTagsConnectOrCreate } from 'src/recipes/helpers/create-recipe/build-tags-data'
import { validateCreateRecipeInput } from 'src/recipes/helpers/create-recipe/recipe-validate'
import { resolveProductsForIngredients } from 'src/recipes/helpers/create-recipe/resolve-products-for-ingredients'
import {
	buildIngredientPatch,
	buildRecipePatch,
	buildStepPatch,
	normalizeTags
} from './helpers/update-recipe/update-recipe-helper'
import { CreateRecipeInput } from './inputs/recipe/create-recipe.input'
import { UpdateRecipeInput } from './inputs/recipe/update-recipe.input'

@Injectable()
export class AdminRecipesService {
	constructor(private readonly prisma: PrismaService) {}

	//* ------------------------------- All Recipes ------------------------------ */
	async getAllRecipes() {
		return this.prisma.recipe.findMany({
			include: {
				recipeSteps: true,
				ingredients: { include: { product: true } },
				tags: true,
				nutritionFacts: true,
				likes: true,
				author: true
			}
		})
	}
	//* ------------------------------ Recipe By Id ------------------------------ */
	async getRecipeById(recipeId: string) {
		const recipe = await this.prisma.recipe.findUnique({
			where: {
				recipeId
			},
			include: {
				recipeSteps: true,
				ingredients: { include: { product: true } },
				tags: true,
				nutritionFacts: true,
				author: true
			}
		})
		if (!recipe) {
			throw new NotFoundException(`Recipe with ID ${recipeId} not found`)
		}
		return recipe
	}

	//* ------------------------------ Create Recipe ----------------------------- */
	async createRecipe(
		authorId: string,
		{ recipeSteps, ingredients, nutritionFacts, tags, ...recipeData }: CreateRecipeInput
	) {
		// Basic guards
		validateCreateRecipeInput(authorId, { ingredients, ...recipeData })
		try {
			return await this.prisma.$transaction(async tx => {
				// Resolve productIds (existing or newly created)
				const productIdsByIndex = await resolveProductsForIngredients(tx, ingredients)

				const stepsData = buildStepsData(recipeSteps)

				const recipe = await tx.recipe.create({
					data: {
						...recipeData,
						author: { connect: { userId: authorId } },

						ingredients: {
							create: ingredients.map((ing, idx) => ({
								quantity: ing.quantity,
								recipeUnit: ing.recipeUnit,
								note: ing.note,
								product: { connect: { productId: productIdsByIndex[idx] } }
							}))
						},

						recipeSteps: { create: stepsData },

						tags: buildTagsConnectOrCreate(tags),

						nutritionFacts: buildNutritionData(nutritionFacts)
					},
					include: {
						ingredients: { include: { product: true } },
						recipeSteps: true,
						tags: true,
						nutritionFacts: true
					}
				})

				return recipe
			})
		} catch (e) {
			// Unique constraint for slug
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
				const target = (e.meta?.target as string[] | undefined)?.join(', ')
				if (target?.includes('slug'))
					throw new ConflictException(`Recipe slug '${recipeData.slug}' already exists`)
				throw new ConflictException('Unique constraint failed')
			}
			throw e
		}
	}

	//* ------------------------------ Delete Recipe ----------------------------- */
	async deleteRecipe(recipeId: string) {
		try {
			return await this.prisma.recipe.delete({
				where: {
					recipeId
				}
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
				throw new NotFoundException(`Recipe with ID ${recipeId} not found`)
			}
		}
	}

	// 	//* ------------------------------ Update Recipe ----------------------------- */

	async updateRecipe(recipeId: string, input: UpdateRecipeInput) {
		if (!recipeId || recipeId.trim() === '') throw new BadRequestException('recipeId is required')

		try {
			return await this.prisma.$transaction(async tx => {
				// ensure recipe exists
				const existing = await tx.recipe.findUnique({
					where: { recipeId },
					select: { recipeId: true }
				})
				if (!existing) throw new NotFoundException(`Recipe with ID '${recipeId}' not found`)

				//# patch recipe scalar fields (only what was provided)
				const recipePatch = buildRecipePatch(input)

				//# enforce slug rules (if we allow slug update)
				if (input.slug !== undefined && input.slug.trim() === '') {
					throw new BadRequestException('Slug cannot be empty')
				}

				if (Object.keys(recipePatch).length) {
					await tx.recipe.update({
						where: { recipeId },
						data: recipePatch
					})
				}

				//# Delete ingredients / steps (if provided)
				if (input.deleteIngredientIds?.length) {
					await tx.recipeIngredient.deleteMany({
						where: { recipeId, recipeIngredientId: { in: input.deleteIngredientIds } }
					})
				}

				if (input.deleteStepIds?.length) {
					await tx.recipeStep.deleteMany({
						where: { recipeId, recipeStepId: { in: input.deleteStepIds } }
					})
				}

				//# update ingredients (patch existing rows)
				if (input.updateIngredients?.length) {
					await Promise.all(
						input.updateIngredients.map(ing =>
							tx.recipeIngredient.updateMany({
								where: { recipeId, recipeIngredientId: ing.recipeIngredientId },
								data: buildIngredientPatch(ing)
							})
						)
					)
					// Optional: check counts to detect wrong IDs
					// (If you want strict behavior, you can re-run updateMany and assert count === 1 for each)
				}

				//# update steps (patch existing rows)
				if (input.updateRecipeSteps?.length) {
					await Promise.all(
						input.updateRecipeSteps.map(step =>
							tx.recipeStep.updateMany({
								where: { recipeId, recipeStepId: step.recipeStepId },
								data: buildStepPatch(step)
							})
						)
					)
				}

				//# replace tags (set empty + connectOrCreate)
				if (input.tags) {
					const tags = normalizeTags(input.tags)

					await tx.recipe.update({
						where: { recipeId },
						data: {
							tags: {
								set: [],
								...(tags.length
									? {
											connectOrCreate: tags.map(tagName => ({
												where: { tagName },
												create: { tagName }
											}))
										}
									: {})
							}
						}
					})
				}

				//# nutrition facts: upsert or delete (if support delete)
				if (input.nutritionFacts !== undefined) {
					const nf = input.nutritionFacts

					if (nf === null) {
						// uncomment to add ability to delete nutritionFacts
						// await tx.nutritionFact.deleteMany({ where: { recipeId } })
					} else {
						await tx.nutritionFact.upsert({
							// assumes NutritionFact has a unique constraint on recipeId
							where: { recipeId },
							create: { recipeId, ...nf },
							update: { ...nf }
						})
					}
				}

				//# return fresh recipe with relations
				return tx.recipe.findUnique({
					where: { recipeId },
					include: {
						//author: true, // only keep if RecipeModel.author is non-null
						ingredients: { include: { product: true } },
						recipeSteps: true,
						tags: true,
						nutritionFacts: true
					}
				})
			})
		} catch (e) {
			// Unique constraint for slug
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
				const target = (e.meta?.target as string[] | undefined)?.join(', ')
				if (target?.includes('slug'))
					throw new ConflictException(`Recipe slug '${input.slug}' already exists`)
				throw new ConflictException('Unique constraint failed')
			}
			throw e
		}
	}
}
