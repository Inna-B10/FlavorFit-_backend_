import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator'
import { RecipeUnit } from 'src/graphql/graphql.enums'

@InputType()
export class UpdateProductInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(120)
	name?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@MaxLength(500)
	@IsUrl()
	iconUrl?: string

	@Field(() => RecipeUnit, { nullable: true })
	@IsOptional()
	@IsEnum(RecipeUnit)
	recipeUnit?: RecipeUnit
}
