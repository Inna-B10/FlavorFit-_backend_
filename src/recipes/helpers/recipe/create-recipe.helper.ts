import { Prisma } from 'prisma/generated/client'
import { rethrowPrismaKnownErrors } from 'src/common/prisma/prisma-errors'
import { CreateRecipeInput } from 'src/recipes/inputs/recipe/create-recipe.input'
import { resolveIngredientProductId } from '../recipe-ingredient-products.helper'
import { assertNoDuplicateProductIds } from '../recipe-ingredient.helper'
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

//* ------------------------------ Create Recipe ----------------------------- */
export async function createRecipeHelper(
	tx: Prisma.TransactionClient,
	userId: string,
	input: CreateRecipeInput
): Promise<CreatedRecipe> {
	const { recipeSteps, ingredients, nutritionFacts, tags, ...recipeData } = input

	const stepsData = normalizeSteps(recipeSteps)

	await assertNoDuplicateProductIds(tx, ingredients)

	try {
		const productIds: string[] = []

		for (const ing of ingredients) {
			productIds.push(await resolveIngredientProductId(tx, ing.productId))
		}

		const recipe = await tx.recipe.create({
			data: {
				...recipeData,
				user: { connect: { userId } },
				recipeSteps: { create: stepsData },
				tags: buildTagsConnectOrCreate(tags),
				nutritionFacts: buildNutritionData(nutritionFacts)
			},
			include: {
				recipeSteps: {
					orderBy: { stepNumber: 'asc' }
				},
				tags: true,
				nutritionFacts: true
			}
		})

		await tx.ingredient.createMany({
			data: ingredients.map((ing, idx) => ({
				recipeId: recipe.recipeId,
				productId: productIds[idx],
				quantity: ing.quantity,
				recipeUnit: ing.recipeUnit,
				ingredientNote: ing.ingredientNote ?? null
			}))
		})

		const fullRecipe = await tx.recipe.findUnique({
			where: { recipeId: recipe.recipeId },
			include: {
				ingredients: { include: { product: true } },
				recipeSteps: {
					orderBy: { stepNumber: 'asc' }
				},
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
