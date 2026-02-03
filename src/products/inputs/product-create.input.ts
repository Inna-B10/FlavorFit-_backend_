import { Field, InputType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { Unit } from 'src/graphql/graphql.enums'
import { DecimalScalar } from 'src/graphql/scalars/decimal.scalar'

@InputType()
export class ProductCreateInput {
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
	@Field(() => DecimalScalar)
	amount: Decimal

	@Field(() => Unit)
	saleUnit: Unit

	@Field(() => DecimalScalar)
	price: Decimal

	@Field({ nullable: true })
	description?: string
}
