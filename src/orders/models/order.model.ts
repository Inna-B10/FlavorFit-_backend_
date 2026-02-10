import { Field, ObjectType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { OrderStatus } from 'prisma/generated/prisma/enums'
import { RecipeModel } from 'src/recipes/models/recipe.model'
import { CourierModel } from './courier.model'
import { OrderItemModel } from './order-item.model'

@ObjectType()
export class OrderModel {
	@Field()
	orderId: string

	@Field()
	orderReference: string

	@Field(() => OrderStatus)
	status: OrderStatus

	@Field(() => Decimal)
	totalPrice: Decimal

	@Field({ nullable: true })
	orderNote?: string

	@Field(() => [OrderItemModel])
	orderItems: OrderItemModel[]

	@Field(() => [RecipeModel])
	recipes: RecipeModel[]

	@Field({ nullable: true })
	courierId?: string

	@Field(() => CourierModel, { nullable: true })
	courier?: CourierModel

	@Field()
	createdAt: Date

	@Field()
	updatedAt: Date
}
