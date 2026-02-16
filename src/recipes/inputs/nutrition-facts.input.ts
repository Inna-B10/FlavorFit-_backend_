import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import Decimal from 'decimal.js'
import { Nutrition } from 'src/common/class-transformer/decimal/decimal.decorators'

@InputType()
export class NutritionFactsInput {
	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	@Nutrition()
	protein?: Decimal

	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	@Nutrition()
	fats?: Decimal

	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	@Nutrition()
	carbohydrates?: Decimal

	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	@Nutrition()
	fiber?: Decimal
}
