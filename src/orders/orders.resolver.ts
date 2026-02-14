import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { Role } from 'src/graphql/graphql.enums'
import { RecipeModel } from 'src/recipes/models/recipe.model'
import { CreateOrderInput } from './inputs/order.input'
import { OrderModel } from './models/order.model'
import { OrdersService } from './orders.service'

type OrderParent = {
	orderRecipes?: Array<{ recipe: RecipeModel }>
}

@Resolver(() => OrderModel)
export class OrdersResolver {
	constructor(private readonly ordersService: OrdersService) {}

	@ResolveField(() => [RecipeModel])
	recipes(@Parent() order: OrderParent): RecipeModel[] {
		return (order.orderRecipes ?? []).map(or => or.recipe)
	}

	//* --------------------------- All Orders By UserId ------------------------- */
	@Query(() => [OrderModel], { name: 'allOrdersByUserId' })
	@Auth()
	getOrdersByUserId(
		@CurrentUser('userId') currentUserId: string,
		@CurrentUser('role') role: Role,
		@Args('userId', { nullable: true }) userId?: string
	) {
		const targetUserId = role === Role.ADMIN && userId ? userId : currentUserId
		return this.ordersService.getOrdersByUserId(targetUserId)
	}

	//* ------------------------------ Order By ID ------------------------------ */
	@Query(() => OrderModel, { name: 'orderById' })
	@Auth()
	getOrderById(
		@CurrentUser('userId') currentUserId: string,
		@CurrentUser('role') role: Role,
		@Args('orderId') orderId: string,
		@Args('userId', { nullable: true }) userId?: string
	) {
		const targetUserId = role === Role.ADMIN && userId ? userId : currentUserId
		return this.ordersService.getOrderById(targetUserId, orderId)
	}

	//* --------------------------- Order By Reference -------------------------- */
	@Query(() => OrderModel, { name: 'orderByReference' })
	@Auth()
	getOrderByReference(
		@CurrentUser('userId') currentUserId: string,
		@CurrentUser('role') role: Role,
		@Args('orderReference') orderReference: string,
		@Args('userId', { nullable: true }) userId?: string
	) {
		const targetUserId = role === Role.ADMIN && userId ? userId : currentUserId
		return this.ordersService.getOrderByReference(targetUserId, orderReference)
	}

	//* ------------------------------ Create Order ------------------------------ */
	@Mutation(() => OrderModel)
	@Auth()
	createOrder(@CurrentUser('userId') userId: string, @Args('input') input: CreateOrderInput) {
		return this.ordersService.createOrder(userId, input)
	}

	/* ========================================================================== */
	/*                                    ADMIN                                   */
	/* ========================================================================== */

	@Query(() => [OrderModel], { name: 'allOrders' })
	@Auth(Role.ADMIN)
	getAllOrders() {
		return this.ordersService.getAllOrders()
	}

	//* ---------------------------- Delete Order By Id --------------------------- */
	@Mutation(() => Boolean)
	@Auth(Role.ADMIN)
	async deleteOrder(@Args('orderId') orderId: string) {
		await this.ordersService.deleteOrderById(orderId)
		return true
	}
}
