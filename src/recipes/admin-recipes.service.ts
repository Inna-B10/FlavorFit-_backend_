import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { rethrowPrismaKnownErrors } from 'src/utils/prisma-errors'
import { applyIngredientChanges } from './helpers/recipe-ingredient.helper'
import { upsertNutritionFacts } from './helpers/recipe-nutrition.helper'
import { applyStepChanges } from './helpers/recipe-steps.helper'
import { syncRecipeTags } from './helpers/recipe-tags'
import {
	createRecipeHelper,
	validateCreateRecipeInput
} from './helpers/recipe/create-recipe.helper'
import { checkRecipeExists, getRecipeFull } from './helpers/recipe/get-recipe.helper'
import { patchRecipeCore } from './helpers/recipe/update-recipe.helper'
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
		return this.prisma.$transaction(tx =>
			createRecipeHelper(tx, authorId, {
				recipeSteps,
				ingredients,
				nutritionFacts,
				tags,
				...recipeData
			})
		)
	}

	// 	//* ------------------------------ Update Recipe ----------------------------- */
	async updateRecipe(recipeId: string, input: UpdateRecipeInput) {
		const shouldBumpIngredientsVersion =
			input.addIngredients !== undefined ||
			input.updateIngredients !== undefined ||
			input.deleteIngredientIds !== undefined

		try {
			return await this.prisma.$transaction(async tx => {
				await checkRecipeExists(tx, recipeId)
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
