import { Field, InputType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { Unit } from 'src/graphql/graphql.enums'

@InputType()
export class CreatePurchaseOptionInput {
	@Field(() => Decimal)
	amount: Decimal

	@Field(() => Unit)
	saleUnit: Unit

	@Field(() => Decimal)
	price: Decimal

	@Field({ nullable: true })
	description?: string
}
