import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { Trim } from 'src/common/class-transformer/string.decorators'

@InputType()
export class RecipeTagInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MinLength(2, { message: 'Tag name is too short' })
	@MaxLength(24, { message: 'Tag name is too long' })
	tagName?: string
}
