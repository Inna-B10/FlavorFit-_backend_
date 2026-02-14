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

	//* -------------------------- Variants By ProductId ------------------------- */
	@Query(() => [ProductVariantModel], { name: 'allProductVariants' })
	@Auth(Role.ADMIN)
	getAllProductVariantsByProductId(@Args('productId') productId: string) {
		return this.productVariantsService.getAllProductVariantsByProductId(productId)
	}

	//* ------------------------------ Variant By Id ------------------------------ */
	@Query(() => ProductVariantModel, { name: 'variantById' })
	@Auth(Role.ADMIN)
	getVariantById(@Args('variantId') variantId: string) {
		return this.productVariantsService.getVariantById(variantId)
	}

	//* ------------------------------ Create Variant ------------------------------ */
	@Mutation(() => ProductVariantModel)
	@Auth(Role.ADMIN)
	async createProductVariant(
		@Args('productId') productId: string,
		@Args('input') input: CreateProductVariantInput
	) {
		return this.productVariantsService.createProductVariant(productId, input)
	}

	//* ------------------------------ Update Variant ------------------------------ */
	@Mutation(() => ProductVariantModel)
	@Auth(Role.ADMIN)
	async updateProductVariant(
		@Args('productVariantId') productVariantId: string,
		@Args('input') input: UpdateProductVariantInput
	) {
		return this.productVariantsService.updateProductVariant(productVariantId, input)
	}

	//* ------------------------------ Delete Variant ------------------------------ */
	@Mutation(() => ProductVariantModel)
	@Auth(Role.ADMIN)
	async deleteProductVariant(@Args('productVariantId') productVariantId: string) {
		return this.productVariantsService.deleteProductVariant(productVariantId)
	}
}
