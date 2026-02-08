import { Field, InputType, Int } from '@nestjs/graphql'
import { Difficulty } from 'src/graphql/graphql.enums'
import { CreateIngredientInput } from '../ingredient/create-ingredient.input'
import { UpdateIngredientInput } from '../ingredient/update-ingredient.input'
import { NutritionFactsInput } from '../nutrition-facts.input'
import { CreateRecipeStepInput } from '../step/create-step.input'
import { UpdateRecipeStepInput } from '../step/update-step.input'

@InputType()
export class UpdateRecipeInput {
	@Field({ nullable: true })
	slug?: string

	@Field({ nullable: true })
	title?: string

	@Field({ nullable: true })
	description?: string

	@Field(() => Difficulty, { nullable: true })
	difficulty?: Difficulty

	@Field(() => Int, { nullable: true })
	cookingTime?: number

	@Field(() => Int, { nullable: true })
	calories?: number

	@Field(() => [String], { nullable: true })
	tags?: string[]

	@Field(() => NutritionFactsInput, { nullable: true })
	nutritionFacts?: NutritionFactsInput

	// Ingredients changes
	@Field(() => [CreateIngredientInput], { nullable: true })
	addIngredients?: CreateIngredientInput[]

	@Field(() => [UpdateIngredientInput], { nullable: true })
	updateIngredients?: UpdateIngredientInput[]

	@Field(() => [String], { nullable: true })
	deleteIngredientIds?: string[]

	// Steps changes
	@Field(() => [CreateRecipeStepInput], { nullable: true })
	addRecipeSteps?: CreateRecipeStepInput[]

	@Field(() => [UpdateRecipeStepInput], { nullable: true })
	updateRecipeSteps?: UpdateRecipeStepInput[]

	@Field(() => [String], { nullable: true })
	deleteStepIds?: string[]
}
