import { NotFoundException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/prisma/client'

//* ---------------------------- Get Updated Cart ---------------------------- */
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

//* ----------------------------- Get Cart Items ----------------------------- */
export async function getCartItems(
	tx: Prisma.TransactionClient,
	userId: string,
	cartItemId: string
) {
	const cartItem = await tx.cartItem.findUnique({
		where: { cartItemId: cartItemId },
		select: {
			cartItemId: true,
			productId: true,
			cart: { select: { userId: true, cartId: true } }
		}
	})

	if (!cartItem) throw new NotFoundException('Cart item not found')
	if (cartItem.cart.userId !== userId) throw new NotFoundException('Cart item not found')

	return cartItem
}
