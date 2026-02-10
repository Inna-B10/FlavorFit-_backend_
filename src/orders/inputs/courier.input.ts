import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class AssignCourierToOrderInput {
	@Field()
	orderId: string

	@Field()
	courierId: string
}
