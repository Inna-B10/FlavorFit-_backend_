import { BadRequestException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/prisma/client'
import { UpdateIngredientInput } from 'src/recipes/inputs/ingredient/update-ingredient.input'
import { UpdateRecipeInput } from 'src/recipes/inputs/recipe/update-recipe.input'
import { getOrCreateProductIdForIngredient } from './recipe-ingredient-products.helper'

//* ------------------------- Apply Ingredient Changes ------------------------- */
export async function applyIngredientChanges(
	tx: Prisma.TransactionClient,
	recipeId: string,
	input: UpdateRecipeInput
) {
	// delete ingredients (if provided)
	if (input.deleteIngredientIds?.length) {
		await tx.ingredient.deleteMany({
			where: { recipeId, ingredientId: { in: input.deleteIngredientIds } }
		})
	}

	// update ingredients (patch existing rows)
	if (input.updateIngredients?.length) {
		const results = await Promise.all(
			input.updateIngredients.map(ing =>
				tx.ingredient.updateMany({
					where: { recipeId, ingredientId: ing.ingredientId },
					data: buildIngredientPatch(ing)
				})
			)
		)

		// strict mode (optional): if some id didn't match -> error
		const notFound = results
			.map((r, i) => ({ count: r.count, id: input.updateIngredients![i].ingredientId }))
			.filter(x => x.count === 0)

		if (notFound.length) {
			throw new BadRequestException(
				`Some ingredients not found in this recipe: ${notFound.map(x => x.id).join(', ')}`
			)
		}
	}

	// add ingredient (productId OR productName -> create Product without variants)
	if (input.addIngredients?.length) {
		// Pre-resolve productIds (sequential or parallel; sequential is easier for debugging)
		const productIds: string[] = []
		for (const ing of input.addIngredients) {
			productIds.push(await getOrCreateProductIdForIngredient(tx, ing))
		}

		// @@unique([recipeId, productId]) means duplicates will throw P2002
		await tx.ingredient.createMany({
			data: input.addIngredients.map((ing, idx) => ({
				recipeId,
				productId: productIds[idx],
				quantity: ing.quantity,
				recipeUnit: ing.recipeUnit,
				note: ing.note
			}))
		})
	}
}

//* -------------------------- Build Ingredient Patch -------------------------- */
export function buildIngredientPatch(
	ing: UpdateIngredientInput
): Prisma.IngredientUpdateManyMutationInput {
	const data: Prisma.IngredientUpdateManyMutationInput = {}

	if (ing.quantity !== undefined) data.quantity = ing.quantity
	if (ing.recipeUnit !== undefined) data.recipeUnit = ing.recipeUnit
	if (ing.note !== undefined) data.note = ing.note

	return data
}
