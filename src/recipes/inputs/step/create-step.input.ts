import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator'
import { Trim } from 'src/common/class-transformer/string.decorators'

@InputType()
export class CreateRecipeStepInput {
	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt({ message: 'Step number must be a number' })
	@Min(1, { message: 'Step number must be higher than 0' })
	stepNumber?: number

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
