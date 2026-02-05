import { Field, InputType } from '@nestjs/graphql'

import { RecipeUnit } from 'src/graphql/graphql.enums'
import { CreatePurchaseOptionInput } from '../purchase-options/create-purchase-options.input'

@InputType()
export class CreateProductInput {
	@Field()
	name: string

	@Field({ nullable: true })
	iconUrl?: string

	@Field(() => RecipeUnit)
	recipeUnit: RecipeUnit

	@Field(() => [CreatePurchaseOptionInput])
	purchaseOptions: CreatePurchaseOptionInput[]
}
