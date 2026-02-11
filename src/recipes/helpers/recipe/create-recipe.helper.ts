import { BadRequestException } from '@nestjs/common'
import { Difficulty, Prisma } from 'prisma/generated/client'
import { CreateRecipeInput } from 'src/recipes/inputs/recipe/create-recipe.input'
import { rethrowPrismaKnownErrors } from 'src/utils/prisma-errors'
import { getOrCreateProductIdsForIngredients } from '../recipe-ingredient-products.helper'
import { buildNutritionData } from '../recipe-nutrition.helper'
import { normalizeSteps } from '../recipe-steps.helper'
import { buildTagsConnectOrCreate } from '../recipe-tags'

type IngredientRefInput = CreateRecipeInput['ingredients'][number]

type CreatedRecipe = Prisma.RecipeGetPayload<{
	include: {
		ingredients: { include: { product: true } }
		recipeSteps: true
		tags: true
		nutritionFacts: true
	}
}>

//* ------------------------ Validate Create Recipe Input ----------------------- */
export function validateCreateRecipeInput(
	authorId: string,
	input: {
		slug: string
		title: string
		description: string
		difficulty: Difficulty
		ingredients: IngredientRefInput[]
	}
) {
	// author
	if (!authorId || authorId.trim() === '') throw new BadRequestException('authorId is required')

	// recipe basics
	if (!input.slug?.trim()) throw new BadRequestException('slug is required')
	if (!input.title?.trim()) throw new BadRequestException('title is required')
	if (!input.description?.trim()) throw new BadRequestException('description is required')
	if (!input.difficulty) throw new BadRequestException('difficulty is required')

	// ingredients
	if (!input.ingredients?.length) throw new BadRequestException('ingredients are required')

	// prevent duplicate products inside one recipe by productId (because of @@unique([recipeId, productId]))
	const providedProductIds = input.ingredients
		.map(i => i.productId)
		.filter((v): v is string => Boolean(v))

	const duplicates = providedProductIds.filter((id, idx) => providedProductIds.indexOf(id) !== idx)
	if (duplicates.length) {
		throw new BadRequestException(
			`Duplicate productId in ingredients: ${[...new Set(duplicates)].join(', ')}`
		)
	}
}

//* ------------------------------ Create Recipe ----------------------------- */
export async function createRecipeHelper(
	tx: Prisma.TransactionClient,
	authorId: string,
	input: CreateRecipeInput
): Promise<CreatedRecipe> {
	const { recipeSteps, ingredients, nutritionFacts, tags, ...recipeData } = input

	// Resolve productIds (existing or newly created)
	const productIdsByIndex = await getOrCreateProductIdsForIngredients(tx, ingredients)

	const stepsData = normalizeSteps(recipeSteps)

	try {
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
	} catch (e) {
		// unique constraint for slug
		rethrowPrismaKnownErrors(e, {
			slug: recipeData.slug
		})
	}
}
