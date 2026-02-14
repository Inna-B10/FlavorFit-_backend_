import { Field, InputType } from '@nestjs/graphql'
import { IsString, MaxLength } from 'class-validator'

@InputType()
export class AssignCourierToOrderInput {
	@Field(() => String)
	@IsString()
	@MaxLength(30)
	orderId: string

	@Field(() => String)
	@IsString()
	@MaxLength(30)
	courierId: string
}
