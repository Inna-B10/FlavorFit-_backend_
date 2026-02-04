import { Field, InputType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { Unit } from 'src/graphql/graphql.enums'

@InputType()
export class UpdatePurchaseOptionInput {
	@Field(() => Decimal, { nullable: true })
	amount?: Decimal

	@Field(() => Unit, { nullable: true })
	saleUnit?: Unit

	@Field(() => Decimal, { nullable: true })
	price?: Decimal

	@Field({ nullable: true })
	description?: string
}
