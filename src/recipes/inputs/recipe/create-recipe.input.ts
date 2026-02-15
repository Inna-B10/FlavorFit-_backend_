import { Field, InputType, Int } from '@nestjs/graphql'
import {
	ArrayMaxSize,
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
import { NutritionFactsInput } from '../nutrition-facts.input'
import { CreateRecipeStepInput } from '../step/create-step.input'

@InputType()
export class CreateRecipeInput {
	@Field(() => String)
	@IsString()
	@MaxLength(160)
	@Matches(/^[a-z0-9-]+$/)
	slug: string

	@Field(() => String)
	@IsString()
	@MaxLength(200)
	title: string

	@Field(() => String)
	@IsString()
	@MaxLength(500)
	description: string

	@Field(() => Difficulty)
	@IsEnum(Difficulty)
	difficulty: Difficulty

	@Field(() => DishType)
	@IsEnum(DishType)
	dishType: DishType

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

	@Field(() => [CreateIngredientInput])
	ingredients: CreateIngredientInput[]

	@Field(() => [CreateRecipeStepInput], { nullable: true })
	recipeSteps?: CreateRecipeStepInput[]

	@Field(() => NutritionFactsInput, { nullable: true })
	nutritionFacts?: NutritionFactsInput
}
