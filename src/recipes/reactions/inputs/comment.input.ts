import { Field, InputType } from '@nestjs/graphql'
import { IsString, MaxLength } from 'class-validator'

@InputType()
export class CreateCommentInput {
	@Field(() => String)
	@IsString()
	@MaxLength(1500)
	message: string

	@Field(() => String)
	@IsString()
	@MaxLength(30)
	recipeId: string
}
@InputType()
export class UpdateCommentInput {
	@Field(() => String)
	@IsString()
	@MaxLength(100)
	message: string
}
