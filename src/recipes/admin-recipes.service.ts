import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { rethrowPrismaKnownErrors } from 'src/utils/prisma-errors'
import { applyIngredientChanges } from './helpers/ingredient-helper'
import { getOrCreateProductIdsForIngredients } from './helpers/ingredient-products.helper'
import { buildNutritionData, upsertNutritionFacts } from './helpers/nutrition.helper'
import {
	ensureRecipeExists,
	getRecipeFull,
	patchRecipeCore,
	validateCreateRecipeInput
} from './helpers/recipe-core.helper'
import { applyStepChanges, normalizeSteps } from './helpers/steps.helper'
import { buildTagsConnectOrCreate, syncRecipeTags } from './helpers/tags.helper'
import { CreateRecipeInput } from './inputs/recipe/create-recipe.input'
import { UpdateRecipeInput } from './inputs/recipe/update-recipe.input'

@Injectable()
export class AdminRecipesService {
	constructor(private readonly prisma: PrismaService) {}

	//* ------------------------------- All Recipes ------------------------------ */
	async getAllRecipes() {
		return this.prisma.recipe.findMany()
	}
	//* ------------------------------ Recipe By Id ------------------------------ */
	async getRecipeById(recipeId: string) {
		const recipe = await this.prisma.recipe.findUnique({
			where: {
				recipeId
			},
			include: {
				ingredients: {
					include: {
						product: {
							include: {
								productVariants: true
							}
						}
					}
				},
				recipeSteps: true,
				tags: true,
				nutritionFacts: true,
				author: true,
				_count: { select: { likes: true } },
				comments: true
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
				const productIdsByIndex = await getOrCreateProductIdsForIngredients(tx, ingredients)

				const stepsData = normalizeSteps(recipeSteps)

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
			// unique constraint for slug
			rethrowPrismaKnownErrors(e, {
				slug: recipeData.slug
			})
		}
	}

	// 	//* ------------------------------ Update Recipe ----------------------------- */
	async updateRecipe(recipeId: string, input: UpdateRecipeInput) {
		const shouldBumpIngredientsVersion =
			input.addIngredients !== undefined ||
			input.updateIngredients !== undefined ||
			input.deleteIngredientIds !== undefined

		try {
			return await this.prisma.$transaction(async tx => {
				await ensureRecipeExists(tx, recipeId)
				await patchRecipeCore(tx, recipeId, input, shouldBumpIngredientsVersion)
				await syncRecipeTags(tx, recipeId, input.tags)
				await upsertNutritionFacts(tx, recipeId, input.nutritionFacts)
				if (shouldBumpIngredientsVersion) {
					await applyIngredientChanges(tx, recipeId, input)
				}
				await applyStepChanges(tx, recipeId, input)

				return getRecipeFull(tx, recipeId)
			})
		} catch (e) {
			rethrowPrismaKnownErrors(e, { slug: input.slug, notFound: { type: 'recipe', id: recipeId } })
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
			rethrowPrismaKnownErrors(e, { notFound: { type: 'recipe', id: recipeId } })
		}
	}
}
