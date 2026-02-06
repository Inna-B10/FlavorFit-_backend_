import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RecipeTagModel {
	@Field()
	tagId: string

	@Field()
	tagName: string
}
