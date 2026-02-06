import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { Role } from 'src/graphql/graphql.enums'
import { CreateProductVariantInput } from '../inputs/product-variant/create-product-variants.input'
import { UpdateProductVariantInput } from '../inputs/product-variant/update-product-variants.input'
import { ProductVariantModel } from '../models/product-variant.model'
import { ProductVariantsService } from './product-variants.service'

@Resolver(() => ProductVariantModel)
export class ProductVariantsResolver {
	constructor(private readonly productVariantsService: ProductVariantsService) {}

	@Query(() => [ProductVariantModel], { name: 'AllProductVariants' })
	getAllProductVariantsByProductId(@Args('productId') productId: string) {
		return this.productVariantsService.getAllProductVariantsByProductId(productId)
	}

	@Mutation(() => ProductVariantModel)
	@Auth(Role.ADMIN)
	async createProductVariant(
		@Args('productId') productId: string,
		@Args('input') input: CreateProductVariantInput
	) {
		return this.productVariantsService.createProductVariant(productId, input)
	}

	@Mutation(() => ProductVariantModel)
	@Auth(Role.ADMIN)
	async updateProductVariant(
		@Args('productVariantId') productVariantId: string,
		@Args('input') input: UpdateProductVariantInput
	) {
		return this.productVariantsService.updateProductVariant(productVariantId, input)
	}

	@Mutation(() => ProductVariantModel)
	@Auth(Role.ADMIN)
	async deleteProductVariant(@Args('productVariantId') productVariantId: string) {
		return this.productVariantsService.deleteProductVariant(productVariantId)
	}
}
