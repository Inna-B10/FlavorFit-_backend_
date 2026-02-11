import { BadRequestException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/client'

type TShoppingListSourceForUpdate = {
	listItemId: string
	amount: Prisma.Decimal
}

//* ----------------------- Find All Sources For Recipe ---------------------- */
export async function findAllSourcesForRecipe(
	tx: Prisma.TransactionClient,
	{ recipeId, listId }: { recipeId: string; listId: string }
) {
	const sources = await tx.shoppingListItemSource.findMany({
		where: { recipeId, listItem: { listId } },
		select: {
			listItemId: true,
			amount: true
		}
	})
	// double check: if something went wrong earlier
	if (sources.length === 0) {
		throw new BadRequestException('Shopping list recipe link exists but has no sources')
	}
	return sources
}

//* ----------------- Subtract Recipe Sources From List Items ---------------- */
export async function subtractRecipeSourcesFromListItems(
	tx: Prisma.TransactionClient,
	sources: TShoppingListSourceForUpdate[]
): Promise<void> {
	for (const s of sources) {
		await tx.shoppingListItem.update({
			where: { listItemId: s.listItemId },
			data: { requiredAmount: { decrement: s.amount } }
		})
	}
}

//* --------------------- Delete Old Sources For Recipe --------------------- */
export async function deleteOldSourcesForRecipe(
	tx: Prisma.TransactionClient,
	recipeId: string,
	listId: string
) {
	await tx.shoppingListItemSource.deleteMany({
		where: {
			recipeId,
			listItem: { listId }
		}
	})
}
