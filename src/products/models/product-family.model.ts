import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ProductFamilyModel {
	@Field()
	familyId: string

	@Field()
	familyName: string
}
