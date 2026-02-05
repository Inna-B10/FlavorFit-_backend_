import { Module } from '@nestjs/common'

import { ShoppingListsResolver } from './shopping-lists.resolver'
import { ShoppingListsService } from './shopping-lists.service'

@Module({
	providers: [ShoppingListsResolver, ShoppingListsService]
})
export class ShoppingListsModule {}
