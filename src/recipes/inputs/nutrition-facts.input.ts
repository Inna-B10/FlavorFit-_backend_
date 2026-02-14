import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import Decimal from 'decimal.js'

@InputType()
export class NutritionFactsInput {
	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	protein?: Decimal

	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	fats?: Decimal

	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	carbohydrates?: Decimal

	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	fiber?: Decimal
}
