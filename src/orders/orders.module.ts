import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { OrdersResolver } from './orders.resolver'
import { OrdersService } from './orders.service'

@Module({
	providers: [OrdersResolver, OrdersService],
	imports: [PrismaModule]
})
export class OrdersModule {}
