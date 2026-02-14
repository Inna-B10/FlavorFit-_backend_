import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator'
import Decimal from 'decimal.js'
import { RecipeUnit } from 'src/graphql/graphql.enums'

@InputType()
export class CreateIngredientInput {
	// If exists in catalog
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(30)
	productId?: string

	// If product doesn't exist - create it
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(120)
	productName?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@MaxLength(500)
	@IsUrl()
	productIconUrl?: string

	@Field(() => RecipeUnit, { nullable: true })
	@IsOptional()
	@IsEnum(RecipeUnit)
	productRecipeUnit?: RecipeUnit

	@Field(() => Decimal)
	quantity: Decimal

	@Field(() => RecipeUnit)
	@IsEnum(RecipeUnit)
	recipeUnit: RecipeUnit

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(300)
	note?: string
}
