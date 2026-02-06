import { BadRequestException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/prisma/client'
import { UpdateRecipeIngredientInput } from 'src/recipes/inputs/recipe-ingredient/update-recipe-ingredient.input'
import { UpdateRecipeInput } from 'src/recipes/inputs/recipe/update-recipe.input'
import { getOrCreateProductIdForIngredient } from './ingredient-products.helper'

//* ------------------------- ApplyIngredientChanges ------------------------- */
export async function applyIngredientChanges(
	tx: Prisma.TransactionClient,
	recipeId: string,
	input: UpdateRecipeInput
) {
	// delete ingredients (if provided)
	if (input.deleteIngredientIds?.length) {
		await tx.recipeIngredient.deleteMany({
			where: { recipeId, recipeIngredientId: { in: input.deleteIngredientIds } }
		})
	}

	// update ingredients (patch existing rows)
	if (input.updateIngredients?.length) {
		const results = await Promise.all(
			input.updateIngredients.map(ing =>
				tx.recipeIngredient.updateMany({
					where: { recipeId, recipeIngredientId: ing.recipeIngredientId },
					data: buildIngredientPatch(ing)
				})
			)
		)

		// strict mode (optional): if some id didn't match -> error
		const notFound = results
			.map((r, i) => ({ count: r.count, id: input.updateIngredients![i].recipeIngredientId }))
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
		await tx.recipeIngredient.createMany({
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

export function buildIngredientPatch(
	ing: UpdateRecipeIngredientInput
): Prisma.RecipeIngredientUpdateManyMutationInput {
	const data: Prisma.RecipeIngredientUpdateManyMutationInput = {}

	if (ing.quantity !== undefined) data.quantity = ing.quantity
	if (ing.recipeUnit !== undefined) data.recipeUnit = ing.recipeUnit
	if (ing.note !== undefined) data.note = ing.note

	return data
}
