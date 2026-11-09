import { Field, InputType } from '@nestjs/graphql'
import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	MaxLength,
	MinLength
} from 'class-validator'
import { Trim } from 'src/common/class-transformer/string.decorators'
import { CulinaryForm, RecipeUnit } from 'src/graphql/graphql.enums'

@InputType()
export class UpdateProductInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MaxLength(120)
	@MinLength(2)
	productName?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsUrl()
	@MaxLength(500)
	iconUrl?: string

	@Field(() => RecipeUnit, { nullable: true })
	@IsOptional()
	@IsEnum(RecipeUnit)
	recipeUnit?: RecipeUnit

	// Product classification
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	familyId?: string | null

	@Field(() => CulinaryForm, { nullable: true })
	@IsOptional()
	@IsEnum(CulinaryForm)
	culinaryForm?: CulinaryForm | null

	@Field(() => [String], { nullable: true })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	searchTerms?: string[]
}
