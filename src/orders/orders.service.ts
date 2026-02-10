import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import Decimal from 'decimal.js'
import { Prisma } from 'prisma/generated/prisma/client'
import { CartsService } from 'src/carts/carts.service'
import { Role } from 'src/graphql/graphql.enums'
import { PrismaService } from 'src/prisma/prisma.service'
import { rethrowPrismaKnownErrors } from 'src/utils/prisma-errors'
import { CreateOrderInput } from './inputs/order.input'

@Injectable()
export class OrdersService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly cartsService: CartsService
	) {}

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
				const cart = await tx.cart.findUnique({
					where: { userId },
					select: {
						cartId: true,
						cartItems: {
							select: {
								cartItemId: true,
								goodsCount: true,
								productId: true,
								product: { select: { name: true } },
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

				if (!cart) {
					// throw new NotFoundException('Cart not found')
					return await this.cartsService.getOrCreateCartByUserId(userId)
				}

				if (!cart.cartItems.length) {
					throw new BadRequestException('Cart is empty')
				}

				//2. split items into ready vs blocked
				const readyItems = cart.cartItems.filter(ci => {
					const hasVariant = ci.productVariantId !== null && ci.productVariantId !== undefined
					const hasCount = ci.goodsCount !== null && ci.goodsCount !== undefined
					return hasVariant && hasCount
				})

				if (!readyItems.length) {
					throw new BadRequestException(
						'No items are ready to order. Select product variant and quantity first.'
					)
				}

				//3. build orderItems snapshots + totals for READY items only
				const orderItemsData: Prisma.OrderItemCreateManyOrderInput[] = []
				let totalPrice = new Decimal(0)

				for (const ci of readyItems) {
					// safety checks (should pass if cart is consistent)
					if (!ci.productVariant || ci.productVariant.productId !== ci.productId) {
						throw new BadRequestException('Invalid product variant for cart item')
					}
					const v = ci.productVariant
					const goodsCount = new Decimal(ci.goodsCount!.toString())
					const price = new Decimal(v.price.toString())
					const pricingAmount = new Decimal(v.pricingAmount.toString())

					// lineTotal = price * (goodsCount / pricingAmount)
					// example: price = 50 for 500g, goodsCount = 1000g => 50 * (1000/500) = 100
					const lineTotal = price.mul(goodsCount).div(pricingAmount)

					totalPrice = totalPrice.add(lineTotal)

					orderItemsData.push({
						goodsCount: new Prisma.Decimal(ci.goodsCount!.toString()),
						productNameAtPurchase: ci.product.name,
						productVariantLabelAtPurchase: v.label,
						priceAtPurchase: new Prisma.Decimal(v.price.toString()),
						pricingAmountAtPurchase: new Prisma.Decimal(v.pricingAmount.toString()),
						pricingUnitAtPurchase: v.pricingUnit,
						lineTotalAtPurchase: new Prisma.Decimal(lineTotal.toFixed(2)),
						// keep optional relation to Product
						productId: ci.productId
					})
				}

				//4. create Order with unique reference (retry on P2002)
				const order = await this.createOrderWithUniqueReference(tx, {
					user: { connect: { userId } },
					status: 'PENDING',
					totalPrice: new Prisma.Decimal(totalPrice.toFixed(2)),
					orderNote: input.orderNote ?? null
				})

				//5. create OrderItems
				await tx.orderItem.createMany({
					data: orderItemsData.map(oi => ({
						...oi,
						orderId: order.orderId
					}))
				})

				//6. collect recipeIds + listItemIds ONLY from READY items (so blocked items don't affect list)
				const recipeIds = new Set<string>()
				// also collect affected (listId, recipeId) pairs for cleanup later
				const affectedPairs = new Set<string>() // `${listId}::${recipeId}`
				// collect listItemIds used in this order (to delete them from ShoppingList)
				const listItemIdsToDelete = new Set<string>()

				for (const ci of readyItems) {
					for (const req of ci.requirements) {
						if (!req.listItem) continue
						listItemIdsToDelete.add(req.listItemId)

						for (const src of req.listItem.sources) {
							recipeIds.add(src.recipeId)
							affectedPairs.add(`${req.listItem.listId}::${src.recipeId}`)
						}
					}
				}

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

				//8. remove ShoppingList items that were actually ordered (READY items only)
				if (listItemIdsToDelete.size) {
					await tx.shoppingListItem.deleteMany({
						where: { listItemId: { in: Array.from(listItemIdsToDelete) } }
					})

					//9. cleanup ShoppingListRecipe: if recipe has no sources left in that list -> remove link
					for (const key of affectedPairs) {
						const [listId, recipeId] = key.split('::')

						const remainingSources = await tx.shoppingListItemSource.count({
							where: {
								recipeId,
								listItem: { listId }
							}
						})

						if (remainingSources === 0) {
							await tx.shoppingListRecipe.deleteMany({
								where: { listId, recipeId }
							})
						}
					}
				}

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

	//* ------------------- Create Order With Unique Reference ------------------- */
	private async createOrderWithUniqueReference(
		tx: Prisma.TransactionClient,
		data: Omit<Prisma.OrderCreateInput, 'orderReference'>
	): Promise<{ orderId: string }> {
		for (let i = 0; i < 5; i++) {
			const orderReference = this.generateOrderReference()
			try {
				return await tx.order.create({
					data: { ...data, orderReference },
					select: { orderId: true }
				})
			} catch (e) {
				if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
					continue // collision, retry
				}
				throw e
			}
		}
		throw new Error('Could not generate unique order reference')
	}

	private generateOrderReference(): string {
		// example: ORD-20260210-482917
		const date = new Date()
		const y = date.getFullYear().toString()
		const m = String(date.getMonth() + 1).padStart(2, '0')
		const d = String(date.getDate()).padStart(2, '0')
		const rnd = Math.floor(100000 + Math.random() * 900000) // 6 digits
		return `ORD-${y}${m}${d}-${rnd}`
	}

	//* ---------------------------- Delete Order By Id --------------------------- */
	async deleteOrderById(orderId: string) {
		await this.prisma.order.delete({ where: { orderId } })
		// return true
	}
}
