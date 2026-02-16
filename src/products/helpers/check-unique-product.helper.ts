import { Prisma, RecipeUnit } from 'prisma/generated/client'

export async function checkUniqueProduct(
	tx: Prisma.TransactionClient,
	productName: string,
	recipeUnit: RecipeUnit
) {
	return await tx.product.findFirst({
		where: {
			productName: { equals: productName, mode: 'insensitive' },
			recipeUnit
		}
	})
}
