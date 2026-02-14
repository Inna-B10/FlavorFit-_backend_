import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString, MaxLength } from 'class-validator'
import Decimal from 'decimal.js'

//* ------------------------ Add Shopping List To Cart ----------------------- */
@InputType()
export class AddManyItemsToCartInputInput {
	@Field(() => String)
	@IsString()
	@MaxLength(30)
	listId: string
}

//* ---------------------------- Add Item To Cart ---------------------------- */
@InputType()
export class AddOneItemToCartInput {
	@Field(() => String)
	@IsString()
	@MaxLength(30)
	listItemId: string
}
//* --------------------------- Update Item In Cart -------------------------- */
@InputType()
export class UpdateCartItemPurchaseInput {
	@Field(() => String)
	@IsString()
	@MaxLength(30)
	cartItemId: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(30)
	productVariantId?: string

	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	goodsCount?: Decimal
}

//* -------------------------- Remove Item From Cart ------------------------- */
@InputType()
export class RemoveCartItemInput {
	@Field(() => String)
	@IsString()
	@MaxLength(30)
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
