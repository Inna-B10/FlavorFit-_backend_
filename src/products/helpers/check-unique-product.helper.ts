import { Prisma, RecipeUnit } from 'prisma/generated/client'

export async function checkUniqueProduct(
	tx: Prisma.TransactionClient,
	name: string,
	recipeUnit: RecipeUnit
) {
	return await tx.product.findFirst({
		where: {
			name: { equals: name, mode: 'insensitive' },
			recipeUnit
		}
	})
}
