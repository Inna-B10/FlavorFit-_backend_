import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { PurchaseOptionsResolver } from './purchase-options.resolver'
import { PurchaseOptionsService } from './purchase-options.service'

@Module({
	imports: [PrismaModule],
	providers: [PurchaseOptionsResolver, PurchaseOptionsService]
})
export class PurchaseOptionsModule {}
