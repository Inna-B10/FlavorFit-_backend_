import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { CartItemResolver } from './cart-item.resolver'
import { CartsResolver } from './carts.resolver'
import { CartsService } from './carts.service'

@Module({
	providers: [CartsResolver, CartsService, CartItemResolver],
	imports: [PrismaModule]
})
export class CartsModule {}
