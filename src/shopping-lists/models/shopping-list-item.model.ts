import { Field, ObjectType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { RecipeUnit } from 'src/graphql/graphql.enums'
import { ProductModel } from 'src/products/models/product.model'
import { ShoppingListItemSourceModel } from './shopping-list-item-source.model'

@ObjectType()
export class ShoppingListItemModel {
	@Field()
	listItemId: string

	@Field(() => ProductModel)
	product: ProductModel

	@Field(() => Decimal)
	requiredAmount: Decimal

	@Field(() => RecipeUnit)
	recipeUnit: RecipeUnit

	@Field(() => [ShoppingListItemSourceModel])
	sources: ShoppingListItemSourceModel[]
}
