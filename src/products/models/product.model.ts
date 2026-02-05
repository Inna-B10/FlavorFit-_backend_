import { Field, ObjectType } from '@nestjs/graphql'
import { RecipeUnit } from 'src/graphql/graphql.enums'
import { ProductVariantModel } from './product-variant.model'

@ObjectType()
export class ProductModel {
	@Field()
	productId: string

	@Field()
	name: string

	@Field({ nullable: true })
	iconUrl?: string

	@Field(() => RecipeUnit)
	recipeUnit: RecipeUnit

	@Field(() => [ProductVariantModel])
	productVariants: ProductVariantModel[]
}
