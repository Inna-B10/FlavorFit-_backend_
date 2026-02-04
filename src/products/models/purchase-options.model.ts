import { Field, ObjectType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { Unit } from 'src/graphql/graphql.enums'

@ObjectType()
export class PurchaseOptionModel {
	@Field()
	purchaseOptionId: string

	@Field(() => Decimal)
	amount: Decimal

	@Field(() => Unit)
	saleUnit: Unit

	@Field(() => Decimal)
	price: Decimal

	@Field({ nullable: true })
	description?: string
}
