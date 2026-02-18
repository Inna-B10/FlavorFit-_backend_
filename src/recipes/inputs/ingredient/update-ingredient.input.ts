import { Field, InputType } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import Decimal from 'decimal.js'
import { Amount, ToDecimal } from 'src/common/class-transformer/decimal/decimal.decorators'
import { IsCuid, Trim } from 'src/common/class-transformer/string.decorators'
import { RecipeUnit } from 'src/graphql/graphql.enums'

@InputType()
export class UpdateIngredientInput {
	@Field(() => String)
	@Trim()
	@IsCuid()
	ingredientId: string

	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	@Type(() => String)
	@ToDecimal()
	@Amount()
	quantity?: Decimal

	@Field(() => RecipeUnit, { nullable: true })
	@IsOptional()
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
