import { Field, InputType, Int } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import {
	ArrayMaxSize,
	IsArray,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	Min,
	MinLength,
	ValidateNested
} from 'class-validator'
import { Trim } from 'src/common/class-transformer/string.decorators'
import { Difficulty, DishType } from 'src/graphql/graphql.enums'
import { CreateIngredientInput } from '../ingredient/create-ingredient.input'
import { UpdateIngredientInput } from '../ingredient/update-ingredient.input'
import { NutritionFactsInput } from '../nutrition-facts.input'
import { CreateRecipeStepInput } from '../step/create-step.input'
import { UpdateRecipeStepInput } from '../step/update-step.input'

@InputType()
export class UpdateRecipeInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MaxLength(160)
	@MinLength(1)
	@Matches(/^[a-z0-9-]+$/)
	slug?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MinLength(1)
	@MaxLength(200)
	title?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MinLength(1)
	@MaxLength(500)
	description?: string

	@Field(() => Difficulty, { nullable: true })
	@IsOptional()
	@IsEnum(Difficulty)
	difficulty?: Difficulty

	@Field(() => DishType, { nullable: true })
	@IsOptional()
	@IsEnum(DishType)
	dishType?: DishType

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	cookingTime?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(0)
	calories?: number

	@Field(() => [String], { nullable: true })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@MinLength(2, { each: true })
	@MaxLength(24, { each: true })
	@Matches(/^[\p{L}\p{N}][\p{L}\p{N}\s-]*$/u, {
		each: true,
		message: 'Each tag must contain only letters/numbers/spaces/hyphens'
	})
	@ArrayMaxSize(20)
	tags?: string[]

	@Field(() => NutritionFactsInput, { nullable: true })
	@IsOptional()
	@ValidateNested()
	@Type(() => NutritionFactsInput)
	nutritionFacts?: NutritionFactsInput

	// Ingredients changes
	@Field(() => [CreateIngredientInput], { nullable: true })
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateIngredientInput)
	addIngredients?: CreateIngredientInput[]

	@Field(() => [UpdateIngredientInput], { nullable: true })
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdateIngredientInput)
	updateIngredients?: UpdateIngredientInput[]

	@Field(() => [String], { nullable: true })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@ArrayMaxSize(100)
	deleteIngredientIds?: string[]

	// Steps changes
	@Field(() => [CreateRecipeStepInput], { nullable: true })
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateRecipeStepInput)
	addRecipeSteps?: CreateRecipeStepInput[]

	@Field(() => [UpdateRecipeStepInput], { nullable: true })
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdateRecipeStepInput)
	updateRecipeSteps?: UpdateRecipeStepInput[]

	@Field(() => [String], { nullable: true })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@ArrayMaxSize(100)
	deleteStepIds?: string[]
}
