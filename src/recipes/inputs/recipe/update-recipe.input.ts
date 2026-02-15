import { Field, InputType, Int } from '@nestjs/graphql'
import {
	ArrayMaxSize,
	IsArray,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	Min
} from 'class-validator'
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
	@MaxLength(160)
	@Matches(/^[a-z0-9-]+$/)
	slug?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(300)
	title?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
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
	@ArrayMaxSize(15)
	@MaxLength(50, { each: true })
	tags?: string[]

	@Field(() => NutritionFactsInput, { nullable: true })
	@IsOptional()
	nutritionFacts?: NutritionFactsInput

	// Ingredients changes
	@Field(() => [CreateIngredientInput], { nullable: true })
	addIngredients?: CreateIngredientInput[]

	@Field(() => [UpdateIngredientInput], { nullable: true })
	updateIngredients?: UpdateIngredientInput[]

	@Field(() => [String], { nullable: true })
	@IsArray()
	@IsString({ each: true })
	@ArrayMaxSize(100)
	deleteIngredientIds?: string[]

	// Steps changes
	@Field(() => [CreateRecipeStepInput], { nullable: true })
	addRecipeSteps?: CreateRecipeStepInput[]

	@Field(() => [UpdateRecipeStepInput], { nullable: true })
	updateRecipeSteps?: UpdateRecipeStepInput[]

	@Field(() => [String], { nullable: true })
	@IsArray()
	@IsString({ each: true })
	@ArrayMaxSize(100)
	deleteStepIds?: string[]
}
