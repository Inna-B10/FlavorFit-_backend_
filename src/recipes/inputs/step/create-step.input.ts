import { Field, InputType, Int } from '@nestjs/graphql'
import { IsOptional, IsString, MaxLength } from 'class-validator'

@InputType()
export class CreateRecipeStepInput {
	@Field(() => Int, { nullable: true })
	@IsOptional()
	stepNumber?: number

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(200)
	title?: string

	@Field(() => String)
	@IsString()
	@MaxLength(2000)
	content: string
}
