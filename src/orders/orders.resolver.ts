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

	//* --------------------------- Get Order By UserId -------------------------- */
	@Query(() => [OrderModel])
	@Auth()
	getOrdersByUserId(@CurrentUser('role') userRole: Role, @CurrentUser('userId') userId: string) {
		return this.ordersService.getOrdersByUserId(userId, userRole)
	}

	//* ---------------------------- Get Order By ID ---------------------------- */
	@Query(() => OrderModel)
	@Auth()
	getOrderById(
		@CurrentUser('role') userRole: Role,
		@CurrentUser('userId') userId: string,
		@Args('orderId') orderId: string
	) {
		return this.ordersService.getOrderById(userId, orderId, userRole)
	}

	//* ------------------------- Get Order By Reference ------------------------- */
	@Query(() => OrderModel)
	@Auth()
	getOrderByReference(
		@CurrentUser('userId') userId: string,
		@CurrentUser('role') userRole: Role,
		@Args('orderReference') orderReference: string
	) {
		return this.ordersService.getOrderByReference(userId, orderReference, userRole)
	}

	//* ------------------------------ Create Order ------------------------------ */
	@Mutation(() => OrderModel)
	@Auth()
	createOrder(@CurrentUser('userId') userId: string, @Args('input') input: CreateOrderInput) {
		return this.ordersService.createOrder(userId, input)
	}

	//* ---------------------------- Delete Order By Id --------------------------- */
	@Mutation(() => Boolean)
	@Auth(Role.ADMIN)
	async deleteOrderById(@Args('orderId') orderId: string) {
		await this.ordersService.deleteOrderById(orderId)
		return true
	}
}
