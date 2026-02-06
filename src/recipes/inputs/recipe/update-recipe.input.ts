import { Field, InputType, Int } from '@nestjs/graphql'
import { Difficulty } from 'src/graphql/graphql.enums'
import { NutritionFactsInput } from '../nutrition-facts.input'
import { CreateRecipeIngredientInput } from '../recipe-ingredient/create-recipe-ingredient.input'
import { UpdateRecipeIngredientInput } from '../recipe-ingredient/update-recipe-ingredient.input'
import { CreateRecipeStepInput } from '../recipe-step/create-recipe-step.input'
import { UpdateRecipeStepInput } from '../recipe-step/update-recipe-step.input'

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
	@Field(() => [CreateRecipeIngredientInput], { nullable: true })
	addIngredients?: CreateRecipeIngredientInput[]

	@Field(() => [UpdateRecipeIngredientInput], { nullable: true })
	updateIngredients?: UpdateRecipeIngredientInput[]

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
