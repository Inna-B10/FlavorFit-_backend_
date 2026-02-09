import { Prisma } from 'prisma/generated/prisma/client'

//* ------------------------ GetOrCreate Shopping List ----------------------- */
export async function getOrCreateShoppingList(tx: Prisma.TransactionClient, userId: string) {
	return tx.shoppingList.upsert({
		where: { userId },
		update: {}, // nothing to update
		create: { userId },
		select: { listId: true }
	})
}

//* ------------------------ Get Updated Shopping List ----------------------- */
export async function getUpdatedShoppingList(tx: Prisma.TransactionClient, listId: string) {
	return tx.shoppingList.findUnique({
		where: { listId },
		include: {
			recipes: { include: { recipe: true } },
			listItems: {
				include: {
					product: true,
					sources: { include: { recipe: true } }
				}
			}
		}
	})
}
