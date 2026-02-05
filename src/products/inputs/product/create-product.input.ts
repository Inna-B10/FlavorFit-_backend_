import { Field, InputType } from '@nestjs/graphql'

import { RecipeUnit } from 'src/graphql/graphql.enums'
import { CreateProductVariantInput } from '../product-variant/create-product-variants.input'

@InputType()
export class CreateProductInput {
	@Field()
	name: string

	@Field({ nullable: true })
	iconUrl?: string

	@Field(() => RecipeUnit)
	recipeUnit: RecipeUnit

	@Field(() => [CreateProductVariantInput])
	productVariants: CreateProductVariantInput[]
}
