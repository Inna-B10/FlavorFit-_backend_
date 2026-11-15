import { Prisma } from 'prisma/generated/client'
import { CreateRecipeDraftInput } from 'src/recipes/inputs/recipe/create-recipe.input'
import { resolveIngredientProductId } from '../recipe-ingredient-products.helper'
import { assertNoDuplicateProductIds } from '../recipe-ingredient.helper'
import { hasNutrition } from '../recipe-nutrition.helper'
import { normalizeSteps } from '../recipe-steps.helper'
import { normalizeTags } from '../recipe-tags'

type CreatedRecipeDraft = Prisma.RecipeDraftGetPayload<{
	include: {
		user: true
		ingredients: {
			include: {
				product: true
			}
		}
		recipeSteps: true
		nutritionFacts: true
	}
}>

//* --------------------------- Create Recipe Draft ---------------------------

export async function createRecipeDraftHelper(
	tx: Prisma.TransactionClient,
	userId: string,
	input: CreateRecipeDraftInput
): Promise<CreatedRecipeDraft> {
	const { recipeSteps, ingredients, nutritionFacts, tags, ...recipeData } = input

	// Normalize recipe steps
	const stepsData = normalizeSteps(recipeSteps)

	// Check duplicate catalog products
	await assertNoDuplicateProductIds(tx, ingredients)

	// Resolve existing products; unresolved names remain as draft values
	const ingredientsData = await Promise.all(
		ingredients.map(async ing => ({
			productId: ing.productId ? await resolveIngredientProductId(tx, ing.productId) : null,
			rawProductName: ing.rawProductName ?? null,
			originalProductName: ing.rawProductName ?? null,
			quantity: ing.quantity ?? null,
			recipeUnit: ing.recipeUnit ?? null,
			ingredientNote: ing.ingredientNote ?? null
		}))
	)

	return tx.recipeDraft.create({
		data: {
			...recipeData,
			user: {
				connect: { userId }
			},
			tags: normalizeTags(tags),
			ingredients: {
				create: ingredientsData
			},
			recipeSteps: {
				create: stepsData
			},
			nutritionFacts: hasNutrition(nutritionFacts) ? { create: nutritionFacts } : undefined
		},
		include: {
			user: true,
			ingredients: {
				include: {
					product: true
				}
			},
			recipeSteps: {
				orderBy: {
					stepNumber: 'asc'
				}
			},
			nutritionFacts: true
		}
	})
}
