import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { Role } from 'src/graphql/graphql.enums'
import { CreatePurchaseOptionInput } from '../inputs/purchase-options/create-purchase-options.input'
import { UpdatePurchaseOptionInput } from '../inputs/purchase-options/update-purchase-options.input'
import { PurchaseOptionModel } from '../models/purchase-options.model'
import { PurchaseOptionsService } from './purchase-options.service'

@Resolver(() => PurchaseOptionModel)
export class PurchaseOptionsResolver {
	constructor(private readonly purchaseOptionsService: PurchaseOptionsService) {}

	@Query(() => [PurchaseOptionModel], { name: 'AllProductPurchaseOptions' })
	getAllPurchaseOptionsByProductId(@Args('productId') productId: string) {
		return this.purchaseOptionsService.getAllPurchaseOptionsByProductId(productId)
	}

	@Mutation(() => PurchaseOptionModel)
	@Auth(Role.ADMIN)
	async createPurchaseOption(
		@Args('productId') productId: string,
		@Args('input') input: CreatePurchaseOptionInput
	) {
		return this.purchaseOptionsService.createPurchaseOption(productId, input)
	}

	@Mutation(() => PurchaseOptionModel)
	@Auth(Role.ADMIN)
	async updatePurchaseOption(
		@Args('purchaseOptionId') purchaseOptionId: string,
		@Args('input') input: UpdatePurchaseOptionInput
	) {
		return this.purchaseOptionsService.updatePurchaseOption(purchaseOptionId, input)
	}

	@Mutation(() => PurchaseOptionModel)
	@Auth(Role.ADMIN)
	async deletePurchaseOption(@Args('purchaseOptionId') purchaseOptionId: string) {
		return this.purchaseOptionsService.deletePurchaseOption(purchaseOptionId)
	}
}
