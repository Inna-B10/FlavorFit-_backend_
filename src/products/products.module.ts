import { Module } from '@nestjs/common'

import { PrismaModule } from 'src/prisma/prisma.module'

import { ProductFamilyResolver } from './product-family/product-family.resolver'
import { ProductFamilyService } from './product-family/product-family.service'
import { ProductVariantsModule } from './product-variants/product-variants.module'
import { ProductsResolver } from './products.resolver'
import { ProductsService } from './products.service'

@Module({
	providers: [ProductsResolver, ProductsService, ProductFamilyResolver, ProductFamilyService],
	imports: [ProductVariantsModule, PrismaModule],
	exports: [ProductsService, ProductFamilyService]
})
export class ProductsModule {}
