import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateCommentInput {
	@Field()
	message: string

	@Field()
	recipeId: string
}
@InputType()
export class UpdateCommentInput {
	@Field()
	message: string
}
