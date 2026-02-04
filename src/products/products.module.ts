import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { ProductsResolver } from './products.resolver'
import { ProductsService } from './products.service'
import { PurchaseOptionsModule } from './purchase-options/purchase-options.module'

@Module({
	providers: [ProductsResolver, ProductsService],
	imports: [PurchaseOptionsModule, PrismaModule],
	exports: [ProductsService]
})
export class ProductsModule {}
