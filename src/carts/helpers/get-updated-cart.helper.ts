import { Prisma } from 'prisma/generated/prisma/client'

export function getUpdatedCart(tx: Prisma.TransactionClient, cartId: string) {
	return tx.cart.findUnique({
		where: { cartId },
		include: {
			cartItems: {
				include: {
					productVariant: true, // selected variant (nullable)
					product: { include: { productVariants: true } }, // options for choice
					requirements: {
						include: {
							listItem: true // shows requiredAmount + recipeUnit
						}
					}
				}
			}
		}
	})
}
