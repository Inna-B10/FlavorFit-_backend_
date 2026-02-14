import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { Role } from 'src/graphql/graphql.enums'
import { CreateProductInput } from './inputs/product/create-product.input'
import { UpdateProductInput } from './inputs/product/update-product.input'
import { ProductModel } from './models/product.model'
import { ProductsService } from './products.service'

@Resolver()
export class ProductsResolver {
	constructor(private readonly productsService: ProductsService) {}

	//* ------------------------------ Create Product ------------------------------ */
	@Mutation(() => ProductModel)
	@Auth()
	createProduct(@Args('input') input: CreateProductInput, @CurrentUser('role') role: Role) {
		return this.productsService.createProduct(input, role)
	}

	/* ========================================================================== */
	/*                                    ADMIN                                   */
	/* ========================================================================== */

	//* ------------------------------ All Products ------------------------------ */
	@Query(() => [ProductModel], { name: 'allProducts' })
	@Auth(Role.ADMIN)
	getAllProducts() {
		return this.productsService.getAllProducts()
	}

	//* -------------------------- All Without Variants --------------------------- */
	@Query(() => [ProductModel], { name: 'productsWithoutVariants' })
	@Auth(Role.ADMIN)
	getWithoutVariants() {
		return this.productsService.getWithoutVariants()
	}

	//* ------------------------------ Product ById ------------------------------ */
	@Query(() => ProductModel, { name: 'productById' })
	@Auth(Role.ADMIN)
	getProductById(@Args('productId') productId: string) {
		return this.productsService.getProductById(productId)
	}

	//* ------------------------------ Update Product ------------------------------ */
	@Mutation(() => ProductModel)
	@Auth(Role.ADMIN)
	updateProduct(@Args('productId') productId: string, @Args('input') input: UpdateProductInput) {
		return this.productsService.updateProduct(productId, input)
	}

	//* ------------------------------ Delete Product ------------------------------ */
	@Mutation(() => ProductModel)
	@Auth(Role.ADMIN)
	deleteProduct(@Args('productId') productId: string) {
		return this.productsService.deleteProduct(productId)
	}
}
