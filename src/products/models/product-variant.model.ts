import { Field, ObjectType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { SaleUnit } from 'src/graphql/graphql.enums'

@ObjectType()
export class ProductVariantModel {
	@Field()
	productVariantId: string

	@Field(() => Decimal)
	pricingAmount: Decimal

	@Field(() => SaleUnit)
	pricingUnit: SaleUnit

	@Field(() => Decimal)
	price: Decimal

	@Field({ nullable: true })
	description?: string
}
