import { Field, InputType } from '@nestjs/graphql'
import { IsString, MaxLength } from 'class-validator'
import { IsCuid, Trim } from 'src/common/class-transformer/string.decorators'

@InputType()
export class CreateCommentInput {
	@Field(() => String)
	@IsString()
	@MaxLength(1500)
	message: string

	@Field(() => String)
	@Trim()
	@IsCuid()
	recipeId: string
}
@InputType()
export class UpdateCommentInput {
	@Field(() => String)
	@IsString()
	@MaxLength(100)
	message: string
}
