import { Field, InputType } from '@nestjs/graphql'
import Decimal from 'decimal.js'

@InputType()
export class NutritionFactInput {
	@Field(() => Decimal, { nullable: true })
	protein?: Decimal

	@Field(() => Decimal, { nullable: true })
	fats?: Decimal

	@Field(() => Decimal, { nullable: true })
	carbohydrates?: Decimal

	@Field(() => Decimal, { nullable: true })
	fiber?: Decimal
}
