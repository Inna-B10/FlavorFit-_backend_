import { Field, ObjectType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { RecipeUnit } from 'src/graphql/graphql.enums'
import { ProductModel } from 'src/products/models/product.model'
import { ShoppingListItemSourceModel } from './shopping-list-item-source.model'

//* ---------------------------- ShoppingListItem ---------------------------- */
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

//* ------------------------------- ItemForCart ------------------------------ */
@ObjectType()
export class ShoppingListItemForCartModel {
	@Field()
	listItemId: string

	@Field(() => Decimal)
	requiredAmount: Decimal

	@Field(() => RecipeUnit)
	recipeUnit: RecipeUnit
}
