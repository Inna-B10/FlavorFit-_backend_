import { Field, InputType, Int } from '@nestjs/graphql'
import { Difficulty } from 'src/graphql/graphql.enums'
import { NutritionFactInput } from '../nutrition-fact.input'
import { CreateRecipeIngredientInput } from '../recipe-ingredient/create-recipe-ingredient.input'
import { CreateRecipeStepInput } from '../recipe-step/create-recipe-step'

@InputType()
export class CreateRecipeInput {
	@Field(() => String)
	slug: string

	@Field(() => String)
	title: string

	@Field(() => String)
	description: string

	@Field(() => Difficulty)
	difficulty: Difficulty

	@Field(() => Int, { nullable: true })
	cookingTime?: number

	@Field(() => Int, { nullable: true })
	calories?: number

	@Field(() => [String], { nullable: true })
	tags?: string[]

	@Field(() => [CreateRecipeIngredientInput])
	ingredients: CreateRecipeIngredientInput[]

	@Field(() => [CreateRecipeStepInput], { nullable: true })
	recipeSteps?: CreateRecipeStepInput[]

	@Field(() => [NutritionFactInput], { nullable: true })
	nutritionFacts?: NutritionFactInput[]
}
