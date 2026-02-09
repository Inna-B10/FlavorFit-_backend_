import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { ShoppingListsResolver } from './shopping-lists.resolver'
import { ShoppingListsService } from './shopping-lists.service'

@Module({
	providers: [ShoppingListsResolver, ShoppingListsService],
	imports: [PrismaModule]
})
export class ShoppingListsModule {}
