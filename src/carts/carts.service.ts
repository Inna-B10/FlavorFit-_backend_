import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { addListItemToCartHelper } from './helpers/add-list-item-to-cart.helper'
import { getUpdatedCart } from './helpers/get-updated-cart.helper'
import { linkRequirement } from './helpers/link-requirement.helper'

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
	//* ---------------------------- Add Item To Cart --------------------------- */
	async addListItemToCart(cartId: string, listItemId: string) {
		return this.prisma.$transaction(async tx => {
			//1. load shopping list item
			const listItem = await tx.shoppingListItem.findUnique({
				where: { listItemId },
				select: {
					listItemId: true,
					productId: true,
					recipeUnit: true,
					requiredAmount: true
				}
			})

			if (!listItem) {
				throw new NotFoundException('Shopping list item not found')
			}

			//2. upsert cart item (unique: [cartId, productId])
			const cartItem = await addListItemToCartHelper(tx, cartId, listItem.productId)

			//3. link requirement (unique: [cartItemId, listItemId])
			await linkRequirement(tx, cartItem.cartItemId, listItem.listItemId)

			//4. return updated cart
			return getUpdatedCart(tx, cartId)
		})
	}
	//* ------------------------ Add Shopping List To Cart ----------------------- */
	async addShoppingListToCart(cartId: string, listId: string) {
		return this.prisma.$transaction(async tx => {
			//1. ensure list exists and load items (minimal fields)
			const list = await tx.shoppingList.findUnique({
				where: { listId },
				select: {
					listId: true,
					listItems: {
						select: {
							listItemId: true,
							productId: true
						}
					}
				}
			})

			if (!list) throw new NotFoundException('Shopping list not found')

			//2. add each list item to cart (idempotent)
			for (const li of list.listItems) {
				const cartItem = await addListItemToCartHelper(tx, cartId, li.productId)

				await linkRequirement(tx, cartItem.cartItemId, li.listItemId)
			}

			//3.return updated cart (with variants available for selection)
			return getUpdatedCart(tx, cartId)
		})
	}
}
