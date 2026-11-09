import { Field, InputType } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import {
	IsDefined,
	IsEnum,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
	ValidateIf
} from 'class-validator'
import Decimal from 'decimal.js'
import { Amount, ToDecimal } from 'src/common/class-transformer/decimal/decimal.decorators'
import { IsCuid, Trim } from 'src/common/class-transformer/string.decorators'
import { RecipeUnit } from 'src/graphql/graphql.enums'

@InputType()
export class CreateIngredientInput {
	@Field(() => String)
	@Trim()
	@IsCuid()
	productId!: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	productIconUrl?: string

	@Field(() => Decimal)
	@Type(() => String)
	@ToDecimal()
	@Amount()
	quantity!: Decimal

	@Field(() => RecipeUnit)
	@IsEnum(RecipeUnit)
	recipeUnit!: RecipeUnit

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MinLength(1, { message: 'Note is too short' })
	@MaxLength(200, { message: 'Note is too long' })
	ingredientNote?: string
}

@InputType()
export class CreateIngredientDraftInput {
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
	rawProductName?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	productIconUrl?: string

	@Field(() => Decimal, { nullable: true })
	@ValidateIf((o: CreateIngredientDraftInput) => !!o.productId)
	@IsDefined({ message: 'Quantity is required when productId is provided' })
	@Type(() => String)
	@ToDecimal()
	@Amount()
	quantity?: Decimal

	@Field(() => RecipeUnit, { nullable: true })
	@ValidateIf((o: CreateIngredientDraftInput) => !!o.productId)
	@IsDefined({ message: 'Recipe unit is required when productId is provided' })
	@IsEnum(RecipeUnit)
	recipeUnit?: RecipeUnit

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MinLength(1, { message: 'Note is too short' })
	@MaxLength(200, { message: 'Note is too long' })
	ingredientNote?: string
}
