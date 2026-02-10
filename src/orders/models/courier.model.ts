import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CourierModel {
	@Field()
	courierId: string

	@Field()
	name: string

	@Field()
	phoneNumber: string
}
