import { Module } from '@nestjs/common'
import { CartsService } from 'src/carts/carts.service'
import { PrismaModule } from 'src/prisma/prisma.module'
import { OrdersResolver } from './orders.resolver'
import { OrdersService } from './orders.service'

@Module({
	providers: [OrdersResolver, OrdersService, CartsService],
	imports: [PrismaModule]
})
export class OrdersModule {}
