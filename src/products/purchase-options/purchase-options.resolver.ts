import { Resolver } from '@nestjs/graphql'
import { PurchaseOptionsService } from './purchase-options.service'

@Resolver()
export class PurchaseOptionsResolver {
	constructor(private readonly purchaseOptionsService: PurchaseOptionsService) {}
}
