import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class CommentModel {
	@Field()
	commentId: string

	@Field()
	message: string

	@Field()
	recipeId: string

	@Field()
	userId: string

	@Field()
	createdAt: Date

	@Field()
	updatedAt: Date
}
