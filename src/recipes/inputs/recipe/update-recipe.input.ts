import { Field, InputType, Int } from '@nestjs/graphql'
import { Difficulty } from 'src/graphql/graphql.enums'
import { NutritionFactsInput } from '../nutrition-facts.input'
import { UpdateRecipeIngredientInput } from '../recipe-ingredient/update-recipe-ingredient.input'
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

	// optional: collections updates
	@Field(() => [UpdateRecipeIngredientInput], { nullable: true })
	updateIngredients?: UpdateRecipeIngredientInput[]

	@Field(() => [UpdateRecipeStepInput], { nullable: true })
	updateRecipeSteps?: UpdateRecipeStepInput[]

	// optional: deletions by id
	@Field(() => [String], { nullable: true })
	deleteIngredientIds?: string[]

	@Field(() => [String], { nullable: true })
	deleteStepIds?: string[]
}
