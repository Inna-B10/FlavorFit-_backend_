import { Field, ObjectType } from '@nestjs/graphql'
import { Unit } from 'src/graphql/graphql.enums'
import { PurchaseOptionModel } from './purchase-options.model'

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
