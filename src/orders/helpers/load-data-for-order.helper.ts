import type { Prisma } from 'prisma/generated/client'

export async function loadDataForOrder(tx: Prisma.TransactionClient, userId: string) {
	return tx.cart.findUnique({
		where: { userId },
		select: {
			cartId: true,
			cartItems: {
				select: {
					cartItemId: true,
					goodsCount: true,
					productId: true,
					product: { select: { productName: true } },
					productVariantId: true,
					productVariant: {
						select: {
							productVariantId: true,
							label: true,
							price: true,
							pricingAmount: true,
							pricingUnit: true,
							productId: true
						}
					},
					requirements: {
						select: {
							listItemId: true,
							listItem: {
								select: {
									listItemId: true,
									listId: true,
									sources: { select: { recipeId: true } }
								}
							}
						}
					}
				}
			}
		}
	})
}
