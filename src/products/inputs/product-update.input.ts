import { Field, InputType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { Unit } from 'src/graphql/graphql.enums'
import { DecimalScalar } from 'src/graphql/scalars/decimal.scalar'

@InputType()
export class ProductUpdateInput {
	@Field()
	productId: string

	@Field()
	name: string

	@Field({ nullable: true })
	iconUrl?: string

	@Field(() => Unit)
	recipeUnit: Unit

	@Field(() => [PurchaseOptionInput])
	purchaseOptions: PurchaseOptionInput[]
}

@InputType()
export class PurchaseOptionInput {
	@Field({ nullable: true })
	purchaseOptionId?: string // if exists - update, if does not - create

	@Field(() => DecimalScalar)
	amount: Decimal

	@Field(() => Unit)
	saleUnit: Unit

	@Field(() => DecimalScalar)
	price: Decimal

	@Field({ nullable: true })
	description?: string
}
