import { Field, HideField, ObjectType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { RecipeUnit } from 'src/graphql/graphql.enums'
import { ProductModel } from 'src/products/models/product.model'

@ObjectType()
export class IngredientModel {
	@Field()
	ingredientId: string

	@Field(() => Decimal)
	quantity: Decimal

	@Field(() => RecipeUnit)
	recipeUnit: RecipeUnit

	@Field({ nullable: true })
	ingredientNote?: string

	@HideField()
	recipeId: string

	@Field()
	productId: string

	@Field(() => ProductModel)
	product: ProductModel
}
