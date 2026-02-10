import { Injectable, NotFoundException } from '@nestjs/common'
import Decimal from 'decimal.js'
import { Prisma } from 'prisma/generated/prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { addOneItemToCartHelper, linkRequirement } from './helpers/add-item.helper'
import { getCartItems, getUpdatedCart } from './helpers/get.helper'
import { validateCartItem } from './helpers/validation-item.helper'

@Injectable()
export class CartsService {
	constructor(private readonly prisma: PrismaService) {}

	//* ----------------------- GetOrCreate Cart By UserId ----------------------- */
	async getOrCreateCartByUserId(userId: string) {
		return this.prisma.cart.upsert({
			where: { userId },
			create: { userId },
			update: {},
			select: { cartId: true }
		})
	}
	//* ---------------------------- Add One Item --------------------------- */
	async addOneItemToCart(cartId: string, listItemId: string) {
		return this.prisma.$transaction(async tx => {
			//1. load shopping list item
			const listItem = await tx.shoppingListItem.findUnique({
				where: { listItemId },
				select: { listItemId: true, productId: true }
			})

			if (!listItem) throw new NotFoundException('Shopping list item not found')

			//2. upsert cart item (unique: [cartId, productId])
			const cartItem = await addOneItemToCartHelper(tx, cartId, listItem.productId)

			//3. link requirement (unique: [cartItemId, listItemId])
			await linkRequirement(tx, cartItem.cartItemId, listItem.listItemId)

			//4. return updated cart
			return getUpdatedCart(tx, cartId)
		})
	}
	//* ------------------------ Add Many Items ----------------------- */
	async addManyItemsToCart(cartId: string, listId: string) {
		return this.prisma.$transaction(async tx => {
			//1. ensure list exists and load items (minimal fields)
			const list = await tx.shoppingList.findUnique({
				where: { listId },
				select: {
					listId: true,
					listItems: {
						select: { listItemId: true, productId: true }
					}
				}
			})

			if (!list) throw new NotFoundException('Shopping list not found')

			//2. add each list item to cart (idempotent)
			for (const li of list.listItems) {
				const cartItem = await addOneItemToCartHelper(tx, cartId, li.productId)
				await linkRequirement(tx, cartItem.cartItemId, li.listItemId)
			}

			//3.return updated cart (with variants available for selection)
			return getUpdatedCart(tx, cartId)
		})
	}

	//* ------------------------ Update Cart Item Purchase ------------------------ */
	async updateCartItemPurchase(
		userId: string,
		cartItemId: string,
		input: { productVariantId?: string | null; goodsCount?: Decimal }
	) {
		return this.prisma.$transaction(async tx => {
			//1. load cartItem + ownership check
			const cartItem = await getCartItems(tx, userId, cartItemId)

			//2-5. validations
			await validateCartItem(tx, cartItem.productId, input.productVariantId, input.goodsCount)

			const variantProvided = input.productVariantId !== undefined
			const countProvided = input.goodsCount !== undefined

			if (!variantProvided && !countProvided) {
				return getUpdatedCart(tx, cartItem.cart.cartId)
			}

			const data: Prisma.CartItemUpdateInput = {}
			// productVariantId
			if (input.productVariantId !== undefined) {
				if (input.productVariantId === null) {
					data.productVariant = { disconnect: true }
				} else {
					data.productVariant = { connect: { productVariantId: input.productVariantId } }
				}
			}

			// goodsCount
			if (input.goodsCount !== undefined) {
				data.goodsCount = input.goodsCount
			}

			//6. apply update
			await tx.cartItem.update({ where: { cartItemId }, data })

			return getUpdatedCart(tx, cartItem.cart.cartId)
		})
	}

	//* ------------------------ Delete One Item ----------------------- */
	async removeCartItem(userId: string, cartItemId: string) {
		return this.prisma.$transaction(async tx => {
			//1. find cartId to return updated cart later
			const cartItem = await tx.cartItem.findFirst({
				where: { cartItemId, cart: { userId } },
				select: { cartId: true }
			})

			if (!cartItem) throw new NotFoundException('Cart item not found')

			//2. delete the row (requirements will be deleted by cascade)
			await tx.cartItem.delete({ where: { cartItemId } })

			return getUpdatedCart(tx, cartItem.cartId)
		})
	}

	//* ---------------------------- Delete All Items ---------------------------- */
	async removeAllCartItems(userId: string) {
		return this.prisma.$transaction(async tx => {
			const cart = await tx.cart.upsert({
				where: { userId },
				create: { userId },
				update: {},
				select: { cartId: true }
			})

			await tx.cartItem.deleteMany({
				where: { cartId: cart.cartId }
			})

			return getUpdatedCart(tx, cart.cartId)
		})
	}

	//разорвать связь между одним из ингредиентов в Листе покупок и ингредиентом в корзине
	// 	async removeCartItemRequirement(cartItemId: string, listItemId: string) {
	// 		return this.prisma.$transaction(async tx => {
	// 			const cartItem = await tx.cartItem.findUnique({
	// 				where: { cartItemId },
	// 				select: { cartId: true }
	// 			})
	// 			if (!cartItem) throw new NotFoundException('Cart item not found')
	//
	// 			await tx.cartItemRequirement.delete({
	// 				where: {
	// 					cartItemId_listItemId: { cartItemId, listItemId }
	// 				}
	// 			})
	//
	// 			// Optional: if no more requirements and user didn't set goodsCount/variant -> auto-delete cartItem
	//
	// 			return getUpdatedCart(tx, cartItem.cartId)
	// 		})
	// 	}
}
