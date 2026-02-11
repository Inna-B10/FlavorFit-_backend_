import { Prisma } from 'prisma/generated/client'

//* ------------------------------ Normalize Tags ----------------------------- */
export function normalizeTags(tags?: string[]): string[] {
	if (!tags?.length) return []

	// Trim, remove empty, unique
	return [...new Set(tags.map(t => t.trim()).filter(Boolean))]
}

//* ------------------------ Build Tags ConnectOrCreate ------------------------ */
export function buildTagsConnectOrCreate(tags?: string[]) {
	const cleaned = normalizeTags(tags)
	if (!cleaned.length) return undefined

	return {
		connectOrCreate: cleaned.map(tagName => ({
			where: { tagName },
			create: { tagName }
		}))
	}
}

// if tags provided - replaces current tags with exactly this list
// if not provided - do nothing
// empty list - clears all tags

//* ----------------------------- Sync Recipe Tags ----------------------------- */
export async function syncRecipeTags(
	tx: Prisma.TransactionClient,
	recipeId: string,
	tags?: string[]
): Promise<void> {
	if (tags === undefined) return // not provided => do nothing

	const cleaned = normalizeTags(tags)

	await tx.recipe.update({
		where: { recipeId },
		data: {
			tags: {
				set: [],
				...(cleaned.length
					? {
							connectOrCreate: cleaned.map(tagName => ({
								where: { tagName },
								create: { tagName }
							}))
						}
					: {})
			}
		}
	})
}
