import { Resolver } from '@nestjs/graphql'
import { ShoppingListsService } from './shopping-lists.service'

@Resolver()
export class ShoppingListsResolver {
	constructor(private readonly shoppingListsService: ShoppingListsService) {}
}
