import { Field, InputType, Int } from '@nestjs/graphql'
import { Difficulty, DishType } from 'src/graphql/graphql.enums'
import { CreateIngredientInput } from '../ingredient/create-ingredient.input'
import { NutritionFactsInput } from '../nutrition-facts.input'
import { CreateRecipeStepInput } from '../step/create-step.input'

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

	@Field(() => DishType)
	dishType: DishType

	@Field(() => Int, { nullable: true })
	cookingTime?: number

	@Field(() => Int, { nullable: true })
	calories?: number

	@Field(() => [String], { nullable: true })
	tags?: string[]

	@Field(() => [CreateIngredientInput])
	ingredients: CreateIngredientInput[]

	@Field(() => [CreateRecipeStepInput], { nullable: true })
	recipeSteps?: CreateRecipeStepInput[]

	@Field(() => NutritionFactsInput, { nullable: true })
	nutritionFacts?: NutritionFactsInput
}
