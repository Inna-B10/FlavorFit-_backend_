import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { CartsService } from './carts.service'
import {
	AddManyItemsToCartInputInput,
	AddOneItemToCartInput,
	RemoveCartItemInput,
	UpdateCartItemPurchaseInput
} from './inputs/cart-item.input'
import { CartModel } from './models/cart.model'

@Resolver()
export class CartsResolver {
	constructor(private readonly cartsService: CartsService) {}

	//* -------------------------- Add One Item To Cart -------------------------- */
	@Mutation(() => CartModel)
	@Auth()
	async addOneItemToCart(
		@CurrentUser('userId') userId: string,
		@Args('input') input: AddOneItemToCartInput
	) {
		const { cartId } = await this.cartsService.getOrCreateCartByUserId(userId)
		return this.cartsService.addOneItemToCart(cartId, input.listItemId)
	}

	//* ------------------------ Add Many Items To Cart ----------------------- */
	@Mutation(() => CartModel)
	async addManyItemsToCartInput(
		@CurrentUser('userId') userId: string,
		@Args('input') input: AddManyItemsToCartInputInput
	) {
		const { cartId } = await this.cartsService.getOrCreateCartByUserId(userId)
		return this.cartsService.addManyItemsToCart(cartId, input.listId)
	}

	//* -------------------- Update Cart Item Purchase Variant ------------------- */
	@Mutation(() => CartModel)
	async updateCartItemPurchase(
		@CurrentUser('userId') userId: string,
		@Args('input') input: UpdateCartItemPurchaseInput
	) {
		return this.cartsService.updateCartItemPurchase(userId, input.cartItemId, {
			productVariantId: input.productVariantId,
			goodsCount: input.goodsCount
		})
	}

	//* --------------------------- Remove One Cart Item --------------------------- */
	@Mutation(() => CartModel)
	@Auth()
	async removeCartItem(
		@CurrentUser('userId') userId: string,
		@Args('input') input: RemoveCartItemInput
	) {
		return this.cartsService.removeCartItem(userId, input.cartItemId)
	}
	//* --------------------------- Remove All Cart Item --------------------------- */
	@Mutation(() => CartModel)
	@Auth()
	async removeAllCartItems(@CurrentUser('userId') userId: string) {
		return this.cartsService.removeAllCartItems(userId)
	}
}
