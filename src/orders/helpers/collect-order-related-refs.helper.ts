type ReadyCartItemForCleanup = {
	requirements: Array<{
		listItemId: string
		listItem: null | {
			listId: string
			sources: Array<{ recipeId: string }>
		}
	}>
}

//* ---------------- Collect Order Links And Cleanup Targets ---------------- */
export function collectOrderRelatedRefs(readyItems: ReadyCartItemForCleanup[]) {
	const recipeIds = new Set<string>()
	const affectedPairs = new Set<string>() // `${listId}::${recipeId}`
	const listItemIdsToDelete = new Set<string>()

	for (const ci of readyItems) {
		for (const req of ci.requirements) {
			if (!req.listItem) continue

			listItemIdsToDelete.add(req.listItemId)

			for (const src of req.listItem.sources) {
				recipeIds.add(src.recipeId)
				affectedPairs.add(`${req.listItem.listId}::${src.recipeId}`)
			}
		}
	}

	return { recipeIds, affectedPairs, listItemIdsToDelete }
}
