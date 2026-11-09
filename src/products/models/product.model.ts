import { Field, ObjectType } from '@nestjs/graphql'
import { CulinaryForm, RecipeUnit } from 'src/graphql/graphql.enums'
import { ProductFamilyModel } from './product-family.model'
import { ProductVariantModel } from './product-variant.model'

@ObjectType()
export class ProductModel {
	@Field()
	productId: string

	@Field()
	productName: string

	@Field({ nullable: true })
	iconUrl?: string

	@Field(() => Boolean)
	isActive: boolean

	@Field(() => RecipeUnit)
	recipeUnit: RecipeUnit

	@Field(() => [ProductVariantModel], { nullable: true })
	productVariants?: ProductVariantModel[]

	@Field(() => ProductFamilyModel, { nullable: true })
	family?: ProductFamilyModel

	@Field(() => CulinaryForm, { nullable: true })
	culinaryForm?: CulinaryForm

	@Field(() => [String])
	searchTerms: string[]
}
