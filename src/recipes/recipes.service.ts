import { Injectable, NotFoundException } from '@nestjs/common'
import { rethrowPrismaKnownErrors } from 'src/common/prisma/prisma-errors'
import { PrismaService } from 'src/prisma/prisma.service'
import { applyIngredientChanges } from './helpers/recipe-ingredient.helper'
import { upsertNutritionFacts } from './helpers/recipe-nutrition.helper'
import { applyStepChanges } from './helpers/recipe-steps.helper'
import { syncRecipeTags } from './helpers/recipe-tags'
import { buildRecipesWhere, getOrderBy } from './helpers/recipe/build-recipes-query.helper'
import {
	createRecipeHelper,
	validateCreateRecipeInput
} from './helpers/recipe/create-recipe.helper'
import { checkRecipeExists, getRecipeFull } from './helpers/recipe/get-recipe.helper'
import { patchRecipeCore } from './helpers/recipe/update-recipe.helper'
import { CreateRecipeInput } from './inputs/recipe/create-recipe.input'
import { RecipesQueryInput } from './inputs/recipe/get-recipes-query.input'
import { UpdateRecipeInput } from './inputs/recipe/update-recipe.input'

@Injectable()
export class RecipesService {
	constructor(private readonly prisma: PrismaService) {}

	//pagination, filter(category, searchTerm:title, description, ingredient=>productName), sorting (default by date, recommended by likes, popularity by views, by cookingTime)
	//* ------------------------------- All Recipes ------------------------------ */
	async getAllRecipes(input: RecipesQueryInput) {
		const page = Math.max(1, input.page ?? 1)
		const limit = Math.min(50, Math.max(1, input.limit ?? 10)) // safety cap
		const skip = (page - 1) * limit

		return this.prisma.recipe.findMany({
			skip,
			take: limit,
			where: buildRecipesWhere(input),
			orderBy: getOrderBy(input.sort),
			include: {
				_count: { select: { likes: true } },
				tags: { select: { tagId: true, tagName: true } },
				user: { select: { firstName: true, email: true } }
			}
		})
	}

	//* --------------------------------- By Slug -------------------------------- */
	async getRecipeBySlug(slug: string) {
		const recipe = await this.prisma.recipe.findUnique({
			where: {
				slug
			},
			include: {
				ingredients: {
					include: {
						product: {
							select: {
								productName: true,
								iconUrl: true
							}
						}
					}
				},
				recipeSteps: { orderBy: { stepNumber: 'asc' } },
				tags: { select: { tagName: true } },
				nutritionFacts: true,
				user: {
					select: {
						firstName: true,
						avatarUrl: true
					}
				},
				_count: { select: { likes: true } }
			}
		})
		if (!recipe) {
			throw new NotFoundException(`Recipe with SLUG ${slug} not found`)
		}
		return recipe
	}

	//* ------------------------------ Create Recipe ----------------------------- */
	async createRecipe(
		userId: string,
		{ recipeSteps, ingredients, nutritionFacts, tags, ...recipeData }: CreateRecipeInput
	) {
		// Basic guards
		validateCreateRecipeInput(userId, { ingredients, ...recipeData })
		return this.prisma.$transaction(tx =>
			createRecipeHelper(tx, userId, {
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
}
