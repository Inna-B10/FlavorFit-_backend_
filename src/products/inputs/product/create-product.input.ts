import { Field, InputType } from '@nestjs/graphql'

import { Type } from 'class-transformer'
import {
	IsArray,
	IsEnum,
	IsOptional,
	IsString,
	IsUrl,
	MaxLength,
	ValidateNested
} from 'class-validator'
import { Trim } from 'src/common/class-transformer/string.decorators'
import { RecipeUnit } from 'src/graphql/graphql.enums'
import { CreateProductVariantInput } from '../product-variant/create-product-variants.input'

@InputType()
export class CreateProductInput {
	@Field(() => String)
	@IsString()
	@Trim()
	@MaxLength(120)
	name: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsUrl()
	@MaxLength(500)
	iconUrl?: string

	@Field(() => RecipeUnit)
	@IsEnum(RecipeUnit)
	recipeUnit: RecipeUnit

	@Field(() => [CreateProductVariantInput], { nullable: true })
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateProductVariantInput)
	productVariants?: CreateProductVariantInput[]
}
