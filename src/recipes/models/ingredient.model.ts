import { Field, ObjectType } from '@nestjs/graphql'

import Decimal from 'decimal.js'
import { RecipeUnit } from 'src/graphql/graphql.enums'
import { ProductModel } from 'src/products/models/product.model'

@ObjectType()
export class RecipeIngredientModel {
	@Field()
	recipeIngredientId: string

	@Field(() => Decimal)
	quantity: Decimal

	@Field(() => RecipeUnit)
	recipeUnit: RecipeUnit

	@Field({ nullable: true })
	note?: string

	@Field()
	recipeId: string

	@Field()
	productId: string

	@Field(() => ProductModel)
	product: ProductModel
}
