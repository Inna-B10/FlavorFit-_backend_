import { Field, InputType } from '@nestjs/graphql'
import { IsCuid, Trim } from 'src/common/class-transformer/string.decorators'

@InputType()
export class AssignCourierToOrderInput {
	@Field(() => String)
	@Trim()
	@IsCuid()
	orderId: string

	@Field(() => String)
	@Trim()
	@IsCuid()
	courierId: string
}
