import { Field, ObjectType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { SaleUnit } from 'src/graphql/graphql.enums'

@ObjectType()
export class OrderItemModel {
	@Field()
	orderItemId: string

	@Field(() => Decimal)
	goodsCount: Decimal

	// snapshots
	@Field()
	productNameAtPurchase: string

	@Field({ nullable: true })
	productVariantLabelAtPurchase?: string

	@Field()
	productIconUrlAtPurchase: string

	@Field(() => Decimal)
	priceAtPurchase: Decimal

	@Field(() => Decimal)
	pricingAmountAtPurchase: Decimal

	@Field(() => SaleUnit)
	pricingUnitAtPurchase: SaleUnit

	@Field(() => Decimal)
	lineTotalAtPurchase: Decimal

	@Field({ nullable: true })
	productId?: string

	// optional: if keep product relation loaded
	// @Field(() => ProductModel, { nullable: true })
	// product?: ProductModel
}
