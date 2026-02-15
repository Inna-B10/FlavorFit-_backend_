import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import Decimal from 'decimal.js'
import { Nutrition } from 'src/common/class-transformer/decimal/decimal.decorators'
import { DecimalScalar } from 'src/graphql/scalars/decimal.scalar'

@InputType()
export class NutritionFactsInput {
	@Field(() => DecimalScalar, { nullable: true })
	@IsOptional()
	@Nutrition()
	protein?: Decimal

	@Field(() => DecimalScalar, { nullable: true })
	@IsOptional()
	@Nutrition()
	fats?: Decimal

	@Field(() => DecimalScalar, { nullable: true })
	@IsOptional()
	@Nutrition()
	carbohydrates?: Decimal

	@Field(() => DecimalScalar, { nullable: true })
	@IsOptional()
	@Nutrition()
	fiber?: Decimal
}
