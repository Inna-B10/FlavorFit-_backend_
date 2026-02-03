import { Module } from '@nestjs/common'
import { ShoppingListResolver } from './shopping-list.resolver'
import { ShoppingListService } from './shopping-list.service'

@Module({
	providers: [ShoppingListResolver, ShoppingListService]
})
export class ShoppingListModule {}
