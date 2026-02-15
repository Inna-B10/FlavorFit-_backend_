import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator'
import { Trim } from 'src/common/class-transformer/string.decorators'

@InputType()
export class CreateRecipeStepInput {
	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	stepNumber?: number

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MinLength(1)
	@MaxLength(200)
	title?: string

	@Field(() => String)
	@IsString()
	@Trim()
	@MinLength(1)
	@MaxLength(2000)
	content: string
}
