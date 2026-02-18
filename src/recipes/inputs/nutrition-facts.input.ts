import { Field, InputType } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { IsOptional } from 'class-validator'
import Decimal from 'decimal.js'
import { Nutrition, ToDecimal } from 'src/common/class-transformer/decimal/decimal.decorators'

@InputType()
export class NutritionFactsInput {
	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	@Type(() => String)
	@ToDecimal()
	@Nutrition()
	protein?: Decimal

	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	@Type(() => String)
	@ToDecimal()
	@Nutrition()
	fats?: Decimal

	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	@Type(() => String)
	@ToDecimal()
	@Nutrition()
	carbohydrates?: Decimal

	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	@Type(() => String)
	@ToDecimal()
	@Nutrition()
	fiber?: Decimal

	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	@Type(() => String)
	@ToDecimal()
	@Nutrition()
	sugar?: Decimal
}
