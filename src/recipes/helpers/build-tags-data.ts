export function buildTagsConnectOrCreate(tags?: string[]) {
	if (!tags?.length) return undefined

	const cleaned = tags.map(t => t.trim()).filter(Boolean)

	if (!cleaned.length) return undefined

	return {
		connectOrCreate: cleaned.map(tagName => ({
			where: { tagName },
			create: { tagName }
		}))
	}
}
