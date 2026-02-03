import { Module } from '@nestjs/common'
import { ProductsResolver } from './products.resolver'
import { ProductsService } from './products.service'
import { PurchaseOptionsModule } from './purchase-options/purchase-options.module'

@Module({
	providers: [ProductsResolver, ProductsService],
	imports: [PurchaseOptionsModule]
})
export class ProductsModule {}
