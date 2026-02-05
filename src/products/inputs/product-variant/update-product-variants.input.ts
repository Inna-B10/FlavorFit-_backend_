import { Field, InputType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { SaleUnit } from 'src/graphql/graphql.enums'

@InputType()
export class UpdateProductVariantInput {
	@Field(() => Decimal, { nullable: true })
	pricingAmount?: Decimal

	@Field(() => SaleUnit, { nullable: true })
	pricingUnit?: SaleUnit

	@Field(() => Decimal, { nullable: true })
	price?: Decimal

	@Field({ nullable: true })
	description?: string
}
