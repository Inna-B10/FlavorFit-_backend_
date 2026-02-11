import { Prisma } from 'prisma/generated/client'

//* ----------------- Remove Ordered Items And Cleanup Links ----------------- */
export async function removeOrderedItemsAndCleanupLinks(
	tx: Prisma.TransactionClient,
	listItemIdsToDelete: Set<string>,
	affectedPairs: Set<string>
) {
	//8. remove ShoppingList items that were actually ordered (READY items only)
	if (!listItemIdsToDelete.size) return

	await tx.shoppingListItem.deleteMany({
		where: { listItemId: { in: Array.from(listItemIdsToDelete) } }
	})

	//9. cleanup ShoppingListRecipe: if recipe has no sources left in that list -> remove link
	for (const key of affectedPairs) {
		const [listId, recipeId] = key.split('::')

		const remainingSources = await tx.shoppingListItemSource.count({
			where: {
				recipeId,
				listItem: { listId }
			}
		})

		if (remainingSources === 0) {
			await tx.shoppingListRecipe.deleteMany({
				where: { listId, recipeId }
			})
		}
	}
}

type ReadyCartItem = { cartItemId: string }

//* ------------------------- Remove READY Cart Items ------------------------- */
export async function removeReadyCartItems(
	tx: Prisma.TransactionClient,
	cartId: string,
	readyItems: ReadyCartItem[]
) {
	//10. remove ONLY ready cart items; blocked items remain in cart
	await tx.cartItem.deleteMany({
		where: { cartId, cartItemId: { in: readyItems.map(x => x.cartItemId) } }
	})
}
