import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { Role } from 'src/graphql/graphql.enums'
import { CreateProductInput } from './inputs/product/create-product.input'
import { UpdateProductInput } from './inputs/product/update-product.input'
import { ProductModel } from './models/product.model'
import { ProductsService } from './products.service'

@Resolver()
export class ProductsResolver {
	constructor(private readonly productsService: ProductsService) {}

	@Query(() => [ProductModel], { name: 'AllProducts' })
	@Auth(Role.ADMIN)
	getAllProducts() {
		return this.productsService.getAllProducts()
	}

	@Query(() => ProductModel, { name: 'ProductById' })
	@Auth(Role.ADMIN)
	getProductById(@Args('productId') productId: string) {
		return this.productsService.getProductById(productId)
	}

	@Mutation(() => ProductModel)
	@Auth(Role.ADMIN)
	createProduct(@Args('input') input: CreateProductInput) {
		return this.productsService.createProduct(input)
	}

	@Mutation(() => ProductModel)
	@Auth(Role.ADMIN)
	updateProduct(@Args('productId') productId: string, @Args('input') input: UpdateProductInput) {
		return this.productsService.updateProduct(productId, input)
	}

	@Mutation(() => ProductModel)
	@Auth(Role.ADMIN)
	deleteProduct(@Args('productId') productId: string) {
		return this.productsService.deleteProduct(productId)
	}
}
