import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { CartsService } from './carts.service'
import { AddListItemToCartInput, AddShoppingListToCartInput } from './inputs/cart-item.input'
import { CartModel } from './models/cart.model'

@Resolver()
export class CartsResolver {
	constructor(private readonly cartsService: CartsService) {}

	//* -------------------------- Add ListItem To Cart -------------------------- */
	@Mutation(() => CartModel)
	@Auth()
	async addListItemToCart(
		@CurrentUser('userId') userId: string,
		@Args('input') input: AddListItemToCartInput
	) {
		const { cartId } = await this.cartsService.getOrCreateCartByUserId(userId)
		return this.cartsService.addListItemToCart(cartId, input.listItemId)
	}

	//* ------------------------ Add Shopping List To Cart ----------------------- */
	@Mutation(() => CartModel)
	async addShoppingListToCart(
		@CurrentUser('userId') userId: string,
		@Args('input') input: AddShoppingListToCartInput
	) {
		const { cartId } = await this.cartsService.getOrCreateCartByUserId(userId)
		return this.cartsService.addShoppingListToCart(cartId, input.listId)
	}
}
