import { Field, InputType, Int } from '@nestjs/graphql'
import { IsInt, IsOptional, MaxLength, Min, MinLength } from 'class-validator'
import { IsCuid, Trim } from 'src/common/class-transformer/string.decorators'

@InputType()
export class UpdateRecipeStepInput {
	@Field(() => String)
	@Trim()
	@IsCuid()
	recipeStepId: string

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	stepNumber?: number

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Trim()
	@MinLength(1)
	@MaxLength(200)
	title?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Trim()
	@MinLength(1)
	@MaxLength(2000)
	content?: string
}
