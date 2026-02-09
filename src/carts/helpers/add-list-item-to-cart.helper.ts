import { Prisma } from 'prisma/generated/prisma/client'

export async function addListItemToCartHelper(
	tx: Prisma.TransactionClient,
	cartId: string,
	productId: string
) {
	return await tx.cartItem.upsert({
		where: {
			cartId_productId: {
				cartId,
				productId
			}
		},
		create: {
			cartId,
			productId,
			goodsCount: null,
			productVariantId: null
		},
		update: {},
		select: { cartItemId: true }
	})
}
