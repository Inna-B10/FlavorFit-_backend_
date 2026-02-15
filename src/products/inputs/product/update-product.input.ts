import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator'
import { Trim } from 'src/common/class-transformer/string.decorators'
import { RecipeUnit } from 'src/graphql/graphql.enums'

@InputType()
export class UpdateProductInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MaxLength(120)
	@MinLength(2)
	name?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsUrl()
	@MaxLength(500)
	iconUrl?: string

	@Field(() => RecipeUnit, { nullable: true })
	@IsOptional()
	@IsEnum(RecipeUnit)
	recipeUnit?: RecipeUnit
}
