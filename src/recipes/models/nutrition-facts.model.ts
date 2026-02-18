import { Field, ObjectType } from '@nestjs/graphql'
import Decimal from 'decimal.js'

@ObjectType()
export class NutritionFactsModel {
	@Field()
	factId: string

	@Field(() => Decimal, { nullable: true })
	protein?: Decimal

	@Field(() => Decimal, { nullable: true })
	fats?: Decimal

	@Field(() => Decimal, { nullable: true })
	carbohydrates?: Decimal

	@Field(() => Decimal, { nullable: true })
	fiber?: Decimal

	@Field(() => Decimal, { nullable: true })
	sugar?: Decimal

	@Field()
	recipeId: string
}
