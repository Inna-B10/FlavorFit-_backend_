import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator'
import { OrderStatus } from 'src/graphql/graphql.enums'

//* --------------------------------- Create --------------------------------- */
@InputType()
export class CreateOrderInput {
	// optional: user note for courier
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(500)
	orderNote?: string
}

//* --------------------------------- Update --------------------------------- */
@InputType()
export class UpdateOrderStatusInput {
	@Field(() => String)
	@IsString()
	@MaxLength(30)
	orderId: string

	@Field(() => OrderStatus)
	@IsEnum(OrderStatus)
	status: OrderStatus
}

//* --------------------------- Create With Address -------------------------- */
// @InputType()
// export class CreateOrderWithAddressInput {
// 	@Field()
// 	addressId: string
//
// 	@Field({ nullable: true })
// 	note?: string
// }
