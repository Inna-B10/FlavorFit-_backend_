import { Field, InputType } from '@nestjs/graphql'
import { OrderStatus } from 'src/graphql/graphql.enums'

//* --------------------------------- Create --------------------------------- */
@InputType()
export class CreateOrderInput {
	// optional: user note for courier
	@Field({ nullable: true })
	orderNote?: string
}

//* --------------------------------- Update --------------------------------- */
@InputType()
export class UpdateOrderStatusInput {
	@Field()
	orderId: string

	@Field(() => OrderStatus)
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
