import { Field, ObjectType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { RecipeUnit } from 'src/graphql/graphql.enums'
import { ProductVariantModel } from 'src/products/models/product-variant.model'
import { ProductModel } from 'src/products/models/product.model'
import { ShoppingListItemForCartModel } from 'src/shopping-lists/models/shopping-list-item.model'

//* ---------------------------------- Cart ---------------------------------- */
@ObjectType()
export class CartModel {
	@Field(() => String)
	cartId: string

	@Field(() => [CartItemModel])
	cartItems: CartItemModel[]

	@Field()
	createdAt: Date

	@Field()
	updatedAt: Date
}

//* -------------------------------- Cart Item -------------------------------- */
@ObjectType()
export class CartItemModel {
	@Field(() => String)
	cartItemId: string

	@Field(() => ProductModel)
	product: ProductModel

	@Field(() => ProductVariantModel, { nullable: true })
	productVariant?: ProductVariantModel

	@Field(() => Decimal, { nullable: true })
	goodsCount: Decimal

	@Field(() => [CartItemRequirementModel])
	requirements: CartItemRequirementModel[]

	@Field(() => [CartItemRequiredAmountModel])
	requiredByRecipes: CartItemRequiredAmountModel[]
}

//* --------------------------- Cart Item Requirement -------------------------- */
@ObjectType()
export class CartItemRequirementModel {
	@Field(() => String)
	cartItemRequirementId: string

	@Field(() => ShoppingListItemForCartModel)
	listItem: ShoppingListItemForCartModel
}

//* ------------------------- Cart Item Required Amount ------------------------- */
@ObjectType()
export class CartItemRequiredAmountModel {
	@Field(() => RecipeUnit)
	recipeUnit: RecipeUnit

	@Field(() => Decimal)
	requiredAmount: Decimal
}
