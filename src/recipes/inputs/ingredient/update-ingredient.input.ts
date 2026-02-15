import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import Decimal from 'decimal.js'
import { Amount } from 'src/common/class-transformer/decimal/decimal.decorators'
import { IsCuid, Trim } from 'src/common/class-transformer/string.decorators'
import { RecipeUnit } from 'src/graphql/graphql.enums'
import { DecimalScalar } from 'src/graphql/scalars/decimal.scalar'

@InputType()
export class UpdateIngredientInput {
	@Field(() => String)
	@Trim()
	@IsCuid()
	ingredientId: string

	@Field(() => DecimalScalar, { nullable: true })
	@IsOptional()
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
	@MaxLength(300)
	@MinLength(1)
	note?: string
}
