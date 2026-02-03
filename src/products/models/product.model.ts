import { Field, ObjectType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { Unit } from 'src/graphql/graphql.enums'
import { DecimalScalar } from 'src/graphql/scalars/decimal.scalar'

@ObjectType()
export class ProductModel {
	@Field()
	productId: string

	@Field()
	name: string

	@Field({ nullable: true })
	iconUrl?: string

	@Field(() => Unit)
	recipeUnit: Unit

	@Field(() => [PurchaseOptionModel])
	purchaseOptions: PurchaseOptionModel[]
}

@ObjectType()
export class PurchaseOptionModel {
	@Field()
	purchaseOptionId: string

	@Field(() => DecimalScalar)
	amount: Decimal

	@Field(() => Unit)
	saleUnit: Unit

	@Field(() => DecimalScalar)
	price: Decimal

	@Field({ nullable: true })
	description?: string
}
