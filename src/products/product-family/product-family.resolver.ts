import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { Role } from 'src/graphql/graphql.enums'

import { CreateProductFamilyInput } from '../inputs/product-family/create-product-family.input'
import { UpdateProductFamilyInput } from '../inputs/product-family/update-product-family.input'
import { ProductFamilyModel } from '../models/product-family.model'
import { ProductFamilyService } from './product-family.service'

@Resolver()
export class ProductFamilyResolver {
	constructor(private readonly productFamilyService: ProductFamilyService) {}

	//* ------------------------------ Create Family ------------------------------

	@Mutation(() => ProductFamilyModel)
	@Auth(Role.ADMIN)
	createFamily(@Args('input') input: CreateProductFamilyInput) {
		return this.productFamilyService.createFamily(input)
	}

	//* ------------------------------ All Families ------------------------------

	@Query(() => [ProductFamilyModel])
	@Auth(Role.ADMIN)
	getAllFamilies() {
		return this.productFamilyService.getAllFamilies()
	}

	//* ------------------------------ Family ById ------------------------------

	@Query(() => ProductFamilyModel)
	@Auth(Role.ADMIN)
	getFamilyById(@Args('familyId', { type: () => String }) familyId: string) {
		return this.productFamilyService.getFamilyById(familyId)
	}

	//* ------------------------------ Update Family ------------------------------

	@Mutation(() => ProductFamilyModel)
	@Auth(Role.ADMIN)
	updateFamily(
		@Args('familyId', { type: () => String }) familyId: string,
		@Args('input') input: UpdateProductFamilyInput
	) {
		return this.productFamilyService.updateFamily(familyId, input)
	}

	//* ------------------------------ Delete Family ------------------------------

	@Mutation(() => ProductFamilyModel)
	@Auth(Role.ADMIN)
	deleteFamily(@Args('familyId', { type: () => String }) familyId: string) {
		return this.productFamilyService.deleteFamily(familyId)
	}
}
