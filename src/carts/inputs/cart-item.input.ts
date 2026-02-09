import { Field, InputType } from '@nestjs/graphql'
import Decimal from 'decimal.js'

//* ------------------------ Add Shopping List To Cart ----------------------- */
@InputType()
export class AddShoppingListToCartInput {
	@Field()
	listId: string
}

//* ---------------------------- Add Item To Cart ---------------------------- */
@InputType()
export class AddListItemToCartInput {
	@Field()
	listItemId: string
}
//* --------------------------- Update Item In Cart -------------------------- */
@InputType()
export class UpdateCartItemPurchaseInput {
	@Field()
	cartItemId: string

	@Field({ nullable: true })
	productVariantId?: string

	@Field(() => Decimal, { nullable: true })
	goodsCount?: Decimal
}

//* -------------------------- Remove Item From Cart ------------------------- */
@InputType()
export class RemoveCartItemInput {
	@Field()
	cartItemId: string
}

// //* ----------------- Remove One Of The Requirements Of Item ----------------- */
// @InputType()
// export class RemoveCartItemRequirementInput {
// 	@Field()
// 	cartItemId: string
//
// 	@Field()
// 	listItemId: string
// }
