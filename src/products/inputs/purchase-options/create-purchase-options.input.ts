import { Field, InputType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { Unit } from 'src/graphql/graphql.enums'

@InputType()
export class CreatePurchaseOptionInput {
	@Field(() => Decimal)
	saleAmount: Decimal

	@Field(() => Unit)
	saleUnit: Unit

	@Field(() => Decimal)
	price: Decimal

	@Field({ nullable: true })
	description?: string
}
