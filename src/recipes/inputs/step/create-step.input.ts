import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { Trim } from 'src/common/class-transformer/string.decorators'

@InputType()
export class CreateRecipeStepInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MinLength(1, { message: 'Title is too short' })
	@MaxLength(200, { message: 'Title is too long' })
	title?: string

	@Field(() => String)
	@IsString()
	@Trim()
	@MinLength(1, { message: 'Content is too short' })
	@MaxLength(2000, { message: 'Content is too long' })
	content: string
}
