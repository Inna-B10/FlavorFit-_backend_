import { Prisma, RecipeSort } from 'prisma/generated/client'
import { RecipesQueryInput } from 'src/recipes/inputs/recipe/get-recipes-query.input'
import { normalizeTags } from '../recipe-tags'

//* ---------------------------------- Where --------------------------------- */
export const buildRecipesWhere = (input: RecipesQueryInput): Prisma.RecipeWhereInput => {
	const { searchTerm, difficulty, dishType, tags } = input

	const and: Prisma.RecipeWhereInput[] = []

	//1. search term across title/description/ingredient=>productName
	if (searchTerm?.trim()) {
		const term = searchTerm.trim()

		and.push({
			OR: [
				{ title: { contains: term, mode: 'insensitive' } },
				{ description: { contains: term, mode: 'insensitive' } },
				{
					ingredients: {
						some: {
							product: { productName: { contains: term, mode: 'insensitive' } }
						}
					}
				}
			]
		})
	}
	//2. enum filters
	if (difficulty) {
		and.push({ difficulty })
	}

	if (dishType) {
		and.push({ dishType })
	}
	//3.1 tags filter(ANY of selected)
	const normalizedTags = normalizeTags(tags)
	if (normalizedTags?.length) {
		and.push({
			tags: {
				some: {
					tagName: { in: normalizedTags }
				}
			}
		})
	}

	//3.2 tags filter (ALL selected)
	// if (tags.length) {
	// 	and.push({
	// 		AND: tags.map(tagName => ({
	// 			tags: { some: { tagName } }
	// 		}))
	// 	})
	// }

	return and.length ? { AND: and } : {}
}

//* -------------------------------- Order By -------------------------------- */
export const getOrderBy = (sort?: RecipeSort): Prisma.RecipeOrderByWithRelationInput[] => {
	switch (sort) {
		case RecipeSort.RECOMMENDED:
			return [{ likes: { _count: Prisma.SortOrder.desc } }, { createdAt: Prisma.SortOrder.desc }]

		case RecipeSort.POPULAR:
			return [{ views: Prisma.SortOrder.desc }, { createdAt: Prisma.SortOrder.desc }]

		case RecipeSort.COOKING_TIME:
			return [{ cookingTime: Prisma.SortOrder.asc }, { createdAt: Prisma.SortOrder.desc }]

		case RecipeSort.NEW:
		default:
			return [{ createdAt: Prisma.SortOrder.asc }]
	}
}
