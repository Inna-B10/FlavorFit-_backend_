import { Field, InputType } from '@nestjs/graphql'
import { Unit } from 'src/graphql/graphql.enums'
import { CreatePurchaseOptionInput } from '../purchase-options/create-purchase-options.input'

@InputType()
export class CreateProductInput {
	@Field()
	name: string

	@Field({ nullable: true })
	iconUrl?: string

	@Field(() => Unit)
	recipeUnit: Unit

	@Field(() => [CreatePurchaseOptionInput])
	purchaseOptions: CreatePurchaseOptionInput[]
}
