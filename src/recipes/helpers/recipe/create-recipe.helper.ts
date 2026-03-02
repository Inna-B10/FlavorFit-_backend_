import { BadRequestException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/client'
import { rethrowPrismaKnownErrors } from 'src/common/prisma/prisma-errors'
import { CreateRecipeInput } from 'src/recipes/inputs/recipe/create-recipe.input'
import { getOrCreateProductIdForIngredient } from '../recipe-ingredient-products.helper'
import { buildNutritionData } from '../recipe-nutrition.helper'
import { normalizeSteps } from '../recipe-steps.helper'
import { buildTagsConnectOrCreate } from '../recipe-tags'

type CreatedRecipe = Prisma.RecipeGetPayload<{
	include: {
		ingredients: { include: { product: true } }
		recipeSteps: true
		tags: true
		nutritionFacts: true
	}
}>

//* ---------------------- Check Ingredients Duplicates ---------------------- */
export function assertNoDuplicateProductIds(ingredients: { productId?: string }[]) {
	// prevent duplicate products inside one recipe by productId (because of @@unique([recipeId, productId]))
	const seen = new Set<string>()
	const dup = new Set<string>()

	for (const i of ingredients) {
		if (!i.productId) continue
		if (seen.has(i.productId)) dup.add(i.productId)
		else seen.add(i.productId)
	}

	if (dup.size) {
		throw new BadRequestException(`Duplicate productId in ingredients: ${[...dup].join(', ')}`)
	}
}

//* ------------------------------ Create Recipe ----------------------------- */
export async function createRecipeHelper(
	tx: Prisma.TransactionClient,
	userId: string,
	input: CreateRecipeInput
): Promise<CreatedRecipe> {
	const { recipeSteps, ingredients, nutritionFacts, tags, ...recipeData } = input

	const stepsData = normalizeSteps(recipeSteps)

	try {
		const recipe = await tx.recipe.create({
			data: {
				...recipeData,
				user: { connect: { userId: userId } },

				recipeSteps: { create: stepsData },

				tags: buildTagsConnectOrCreate(tags),

				nutritionFacts: buildNutritionData(nutritionFacts)
			},
			include: {
				recipeSteps: true,
				tags: true,
				nutritionFacts: true
			}
		})

		const productIds: string[] = []
		for (const ing of ingredients) {
			productIds.push(await getOrCreateProductIdForIngredient(tx, ing))
		}
		if (productIds.length !== ingredients.length) {
			throw new BadRequestException('Resolved productIds mismatch')
		}

		await tx.ingredient.createMany({
			data: ingredients.map((ing, idx) => ({
				recipeId: recipe.recipeId,
				productId: productIds[idx],
				quantity: ing.quantity,
				recipeUnit: ing.recipeUnit,
				ingredientNote: ing.ingredientNote ?? null // IMPORTANT
			}))
		})

		const fullRecipe = await tx.recipe.findUnique({
			where: { recipeId: recipe.recipeId },
			include: {
				ingredients: { include: { product: true } },
				recipeSteps: true,
				tags: true,
				nutritionFacts: true
			}
		})

		return fullRecipe!
	} catch (e) {
		// unique constraint for slug
		rethrowPrismaKnownErrors(e, {
			slug: recipeData.slug
		})
	}
}
