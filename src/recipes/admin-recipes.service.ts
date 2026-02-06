import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { buildNutritionData } from 'src/recipes/helpers/build-nutrition-data'
import { buildStepsData } from 'src/recipes/helpers/build-steps-data'
import { buildTagsConnectOrCreate } from 'src/recipes/helpers/build-tags-data'
import { validateCreateRecipeInput } from 'src/recipes/helpers/recipe-validate'
import { resolveProductsForIngredients } from 'src/recipes/helpers/resolve-products-for-ingredients'
import { CreateRecipeInput } from './inputs/recipe/create-recipe.input'

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

	// 	async updateRecipe(
	// 		recipeId: string,
	// 		{ recipeSteps, ingredients, nutritionFacts, ...recipeData }: UpdateRecipeInput
	// 	) {
	// 		try {
	// 			return await this.prisma.recipe.update({
	// 				where: { recipeId },
	// 				data: {
	// 					...recipeData,
	// 					recipeSteps: {
	// 						update: {
	// 							where: {
	// 								recipeId,
	// 								data: recipeSteps
	// 							}
	// 						}
	// 					}
	// 				}
	// 			})
	// 		} catch (e) {
	// 			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
	// 				throw new NotFoundException(`Recipe with ID '${recipeId}' not found`)
	// 			}
	// 			throw e
	// 		}
	// 	}
	//
}
