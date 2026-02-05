import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { ProductVariantsResolver } from './product-variants.resolver'
import { ProductVariantsService } from './product-variants.service'

@Module({
	imports: [PrismaModule],
	providers: [ProductVariantsResolver, ProductVariantsService]
})
export class ProductVariantsModule {}
