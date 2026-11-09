import { Field, HideField, ObjectType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { RecipeUnit } from 'src/graphql/graphql.enums'
import { ProductModel } from 'src/products/models/product.model'

@ObjectType()
export class IngredientModel {
	@Field()
	ingredientId!: string

	@Field(() => Decimal)
	quantity!: Decimal

	@Field(() => RecipeUnit)
	recipeUnit!: RecipeUnit

	@Field({ nullable: true })
	ingredientNote?: string

	@HideField()
	recipeId!: string

	@Field(() => String)
	productId!: string

	@Field(() => ProductModel)
	product!: ProductModel
}

@ObjectType()
export class IngredientDraftModel {
	@Field()
	ingredientDraftId!: string

	@Field(() => Decimal, { nullable: true })
	quantity?: Decimal

	@Field(() => RecipeUnit, { nullable: true })
	recipeUnit?: RecipeUnit

	@Field({ nullable: true })
	ingredientNote?: string

	@HideField()
	recipeDraftId!: string

	@Field(() => String, { nullable: true })
	rawProductName?: string

	@Field(() => String, { nullable: true })
	productId?: string

	@Field(() => ProductModel, { nullable: true })
	product?: ProductModel
}
