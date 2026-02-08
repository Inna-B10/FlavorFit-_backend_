import Decimal from 'decimal.js'
import { Prisma } from 'prisma/generated/prisma/client'
import { RecipeUnit } from 'src/graphql/graphql.enums'

// English comments as you prefer
type TRecipeIngredientsPayload = {
	ingredientsVersion: number
	ingredients: Array<{
		productId: string
		quantity: Decimal
		recipeUnit: RecipeUnit
		note: string | null
	}>
}

export async function applyIngredientsToShoppingList(
	tx: Prisma.TransactionClient,
	params: {
		listId: string
		recipeId: string
		recipe: TRecipeIngredientsPayload
	}
): Promise<void> {
	const { listId, recipeId, recipe } = params

	for (const ing of recipe.ingredients) {
		// upsert aggregated list item (unique: [listId, productId, recipeUnit])
		const listItem = await tx.shoppingListItem.upsert({
			where: {
				listId_productId_recipeUnit: {
					listId,
					productId: ing.productId,
					recipeUnit: ing.recipeUnit
				}
			},
			create: {
				listId,
				productId: ing.productId,
				recipeUnit: ing.recipeUnit,
				requiredAmount: ing.quantity,
				isChecked: false
			},
			update: {
				requiredAmount: { increment: ing.quantity }
			},
			select: { listItemId: true }
		})

		// create source snapshot (unique: [listItemId, recipeId])
		await tx.shoppingListItemSource.create({
			data: {
				listItemId: listItem.listItemId,
				recipeId,
				ingredientsVersionUsed: recipe.ingredientsVersion,
				amount: ing.quantity,
				recipeUnit: ing.recipeUnit,
				note: ing.note ?? null
			}
		})
	}
}
