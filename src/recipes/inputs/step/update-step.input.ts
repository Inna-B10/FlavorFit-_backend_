import { Field, InputType, Int } from '@nestjs/graphql'
import { IsOptional, IsString, MaxLength } from 'class-validator'

@InputType()
export class UpdateRecipeStepInput {
	@Field(() => String)
	@IsString()
	@MaxLength(30)
	recipeStepId: string

	@Field(() => Int, { nullable: true })
	@IsOptional()
	stepNumber?: number

	@Field(() => String, { nullable: true })
	@IsOptional()
	title?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	content?: string
}
