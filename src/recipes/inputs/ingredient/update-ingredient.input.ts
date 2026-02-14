import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator'
import Decimal from 'decimal.js'
import { RecipeUnit } from 'src/graphql/graphql.enums'

@InputType()
export class UpdateIngredientInput {
	@Field(() => String)
	@IsString()
	@MaxLength(30)
	ingredientId: string

	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	quantity?: Decimal

	@Field(() => RecipeUnit, { nullable: true })
	@IsOptional()
	@IsEnum(RecipeUnit)
	recipeUnit?: RecipeUnit

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(300)
	note?: string
}
