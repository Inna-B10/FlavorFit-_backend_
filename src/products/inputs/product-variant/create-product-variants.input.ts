import { Field, InputType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { SaleUnit } from 'src/graphql/graphql.enums'

@InputType()
export class CreateProductVariantInput {
	@Field(() => Decimal)
	pricingAmount: Decimal

	@Field(() => SaleUnit)
	pricingUnit: SaleUnit

	@Field(() => Decimal)
	price: Decimal

	@Field({ nullable: true })
	description?: string
}
