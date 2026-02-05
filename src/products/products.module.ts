import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { ProductVariantsModule } from './product-variants/product-variants.module'
import { ProductsResolver } from './products.resolver'
import { ProductsService } from './products.service'

@Module({
	providers: [ProductsResolver, ProductsService],
	imports: [ProductVariantsModule, PrismaModule],
	exports: [ProductsService]
})
export class ProductsModule {}
