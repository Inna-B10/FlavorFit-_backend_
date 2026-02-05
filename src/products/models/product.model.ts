import { Field, ObjectType } from '@nestjs/graphql'
import { RecipeUnit } from 'src/graphql/graphql.enums'
import { PurchaseOptionModel } from './purchase-options.model'

@ObjectType()
export class ProductModel {
	@Field()
	productId: string

	@Field()
	name: string

	@Field({ nullable: true })
	iconUrl?: string

	@Field(() => RecipeUnit)
	recipeUnit: RecipeUnit

	@Field(() => [PurchaseOptionModel])
	purchaseOptions: PurchaseOptionModel[]
}
