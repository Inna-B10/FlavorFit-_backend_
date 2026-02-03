import { Resolver } from '@nestjs/graphql'
import { ShoppingListService } from './shopping-list.service'

@Resolver()
export class ShoppingListResolver {
	constructor(private readonly shoppingListService: ShoppingListService) {}
}
