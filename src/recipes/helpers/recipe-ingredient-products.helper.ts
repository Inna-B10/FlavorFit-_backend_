import { BadRequestException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/client'

//* -------------------------- Resolve Product ID --------------------------

export async function resolveIngredientProductId(
	tx: Prisma.TransactionClient,
	productId: string
): Promise<string> {
	const product = await tx.product.findUnique({
		where: { productId },
		select: { productId: true }
	})

	if (!product) {
		throw new BadRequestException(`Product with ID '${productId}' not found`)
	}

	return product.productId
}
