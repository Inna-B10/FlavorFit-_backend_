import { Field, InputType } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { IsEnum, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator'
import Decimal from 'decimal.js'
import { Amount, ToDecimal } from 'src/common/class-transformer/decimal/decimal.decorators'
import { IsCuid, Trim } from 'src/common/class-transformer/string.decorators'
import { RecipeUnit } from 'src/graphql/graphql.enums'

@InputType()
export class CreateIngredientInput {
	// If exists in catalog
	@Field(() => String, { nullable: true })
	@IsOptional()
	@Trim()
	@IsCuid()
	productId?: string

	// If product doesn't exist - create it
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MaxLength(120, { message: 'Product name is too long' })
	@MinLength(2, { message: 'Product name is too short' })
	productName?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsUrl()
	@MaxLength(500)
	productIconUrl?: string

	@Field(() => Decimal)
	@Type(() => String)
	@ToDecimal()
	@Amount()
	quantity: Decimal

	@Field(() => RecipeUnit)
	@IsEnum(RecipeUnit)
	recipeUnit: RecipeUnit

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MinLength(1, { message: 'Note is too short' })
	@MaxLength(200, { message: 'Note is too long' })
	ingredientNote?: string
}
