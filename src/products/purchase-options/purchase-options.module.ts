import { Module } from '@nestjs/common'
import { PurchaseOptionsResolver } from './purchase-options.resolver'
import { PurchaseOptionsService } from './purchase-options.service'

@Module({
	providers: [PurchaseOptionsResolver, PurchaseOptionsService]
})
export class PurchaseOptionsModule {}
