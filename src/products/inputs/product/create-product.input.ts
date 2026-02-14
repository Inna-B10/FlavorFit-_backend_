import { Field, InputType } from '@nestjs/graphql'

import { IsEnum, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator'
import { RecipeUnit } from 'src/graphql/graphql.enums'
import { CreateProductVariantInput } from '../product-variant/create-product-variants.input'

@InputType()
export class CreateProductInput {
	@Field(() => String)
	@IsString()
	@MaxLength(120)
	name: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@MaxLength(500)
	@IsUrl()
	iconUrl?: string

	@Field(() => RecipeUnit)
	@IsEnum(RecipeUnit)
	recipeUnit: RecipeUnit

	@Field(() => [CreateProductVariantInput], { nullable: true })
	productVariants?: CreateProductVariantInput[]
}
