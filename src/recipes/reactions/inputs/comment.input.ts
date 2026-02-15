import { Field, InputType } from '@nestjs/graphql'
import { IsString, MaxLength, MinLength } from 'class-validator'
import { IsCuid, Trim } from 'src/common/class-transformer/string.decorators'

@InputType()
export class CreateCommentInput {
	@Field(() => String)
	@IsString()
	@Trim()
	@MinLength(1)
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
	@Trim()
	@MinLength(1)
	@MaxLength(1500)
	message: string
}
