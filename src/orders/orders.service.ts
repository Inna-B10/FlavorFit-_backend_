import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, Role } from 'prisma/generated/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { rethrowPrismaKnownErrors } from 'src/utils/prisma-errors'
import { buildOrderItemsSnapshot } from './helpers/build-order-items-snapshot.helper'
import { removeOrderedItemsAndCleanupLinks } from './helpers/clean-up-order-data.helper'
import { collectOrderRelatedRefs } from './helpers/collect-order-related-refs.helper'
import { createOrderWithUniqueReference } from './helpers/create-order-with-reference.helper'
import { loadDataForOrder } from './helpers/load-data-for-order.helper'
import { CreateOrderInput } from './inputs/order.input'

@Injectable()
export class OrdersService {
	constructor(private readonly prisma: PrismaService) {}

	//* ----------------------------- Orders By UserId ---------------------------- */
	getOrdersByUserId(userId: string, userRole: Role) {
		const where =
			userRole === Role.ADMIN
				? {} // admin can read any
				: { userId } // user can read only own

		return this.prisma.order.findMany({
			where,
			orderBy: { createdAt: 'desc' },
			include: {
				orderItems: true,
				orderRecipes: { include: { recipe: true } }
			}
		})
	}

	//* ------------------------------ Order By Id ------------------------------- */
	async getOrderById(userId: string, orderId: string, userRole: Role) {
		const where =
			userRole === Role.ADMIN
				? { orderId } // admin can read any
				: { orderId, userId } // user can read only own

		const order = await this.prisma.order.findFirst({
			where,
			include: {
				orderItems: true,
				orderRecipes: { include: { recipe: true } },
				courier: true
			}
		})
		if (!order) {
			throw new NotFoundException('Order not found')
		}
		return order
	}

	//* ------------------------- Order By Reference -------------------------- */
	async getOrderByReference(userId: string, orderReference: string, userRole: Role) {
		const where =
			userRole === Role.ADMIN
				? { orderReference } // admin can read any
				: { orderReference, userId } // user can read only own

		const order = await this.prisma.order.findFirst({
			where,
			include: {
				orderItems: true,
				orderRecipes: { include: { recipe: true } },
				courier: true
			}
		})

		if (!order) {
			throw new NotFoundException('Order not found')
		}

		return order
	}

	//* -------------------------------- Create Order -------------------------------- */
	async createOrder(userId: string, input: CreateOrderInput) {
		try {
			return await this.prisma.$transaction(async tx => {
				//1. load user's cart with everything needed for order + recipe links
				const cart = await loadDataForOrder(tx, userId)

				if (!cart) {
					throw new NotFoundException('Cart not found')
				}

				if (!cart.cartItems.length) {
					throw new BadRequestException('Cart is empty')
				}

				//2. split items into ready vs blocked/without productVariant
				const readyItems = cart.cartItems.filter(
					(
						ci
					): ci is (typeof cart.cartItems)[number] & {
						productVariantId: string
						productVariant: NonNullable<(typeof cart.cartItems)[number]['productVariant']>
					} => ci.productVariantId !== null && ci.productVariant !== null && ci.goodsCount.gt(0)
				)

				if (!readyItems.length) {
					throw new BadRequestException(
						'No items are ready to order. Select product variant and quantity first.'
					)
				}

				//3. build orderItems snapshots + totals for READY items only
				const { orderItemsData, totalPrice } = buildOrderItemsSnapshot(readyItems)

				//4. create Order with unique reference (retry on P2002)
				const order = await createOrderWithUniqueReference(tx, {
					user: { connect: { userId } },
					status: 'PENDING',
					totalPrice: new Prisma.Decimal(totalPrice.toFixed(2)),
					orderNote: input.orderNote ?? null
				})

				//5. create OrderItems
				await tx.orderItem.createMany({
					data: orderItemsData.map(oi => ({ ...oi, orderId: order.orderId }))
				})

				//6. collect recipeIds + listItemIds ONLY from READY items (so blocked items don't affect list)
				const { recipeIds, affectedPairs, listItemIdsToDelete } =
					collectOrderRelatedRefs(readyItems)

				//7. create OrderRecipe links
				if (recipeIds.size) {
					await tx.orderRecipe.createMany({
						data: Array.from(recipeIds).map(recipeId => ({
							orderId: order.orderId,
							recipeId
						})),
						skipDuplicates: true
					})
				}

				//8-9. remove ShoppingList items that were actually ordered (READY items only) + cleanup ShoppingListRecipe: if recipe has no sources left in that list -> remove link
				await removeOrderedItemsAndCleanupLinks(tx, listItemIdsToDelete, affectedPairs)

				//10. clear ONLY ready cart items; blocked items remain in cart
				await tx.cartItem.deleteMany({
					where: { cartId: cart.cartId, cartItemId: { in: readyItems.map(x => x.cartItemId) } }
				})

				//11. return created order with items + orderRecipes.recipe
				return tx.order.findUnique({
					where: { orderId: order.orderId },
					include: {
						orderItems: true,
						orderRecipes: { include: { recipe: true } }
					}
				})
			})
		} catch (e) {
			rethrowPrismaKnownErrors(e)
		}
	}

	//* ---------------------------- Delete Order By Id --------------------------- */
	async deleteOrderById(orderId: string) {
		await this.prisma.order.delete({ where: { orderId } })
		// return true
	}
}
