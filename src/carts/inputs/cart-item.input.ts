import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import Decimal from 'decimal.js'
import { Amount } from 'src/common/class-transformer/decimal/decimal.decorators'
import { IsCuid, Trim } from 'src/common/class-transformer/string.decorators'

//* ------------------------ Add Shopping List To Cart ----------------------- */
@InputType()
export class AddManyItemsToCartInputInput {
	@Field(() => String)
	@Trim()
	@IsCuid()
	listId: string
}

//* ---------------------------- Add Item To Cart ---------------------------- */
@InputType()
export class AddOneItemToCartInput {
	@Field(() => String)
	@Trim()
	@IsCuid()
	listItemId: string
}
//* --------------------------- Update Item In Cart -------------------------- */
@InputType()
export class UpdateCartItemPurchaseInput {
	@Field(() => String)
	@Trim()
	@IsCuid()
	cartItemId: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@Trim()
	@IsCuid()
	productVariantId?: string

	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	@Amount()
	goodsCount?: Decimal
}

//* -------------------------- Remove Item From Cart ------------------------- */
@InputType()
export class RemoveCartItemInput {
	@Field(() => String)
	@Trim()
	@IsCuid()
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
