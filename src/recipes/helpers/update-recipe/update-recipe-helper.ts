import { Prisma } from 'prisma/generated/prisma/client'
import { UpdateRecipeIngredientInput } from 'src/recipes/inputs/recipe-ingredient/update-recipe-ingredient.input'
import { UpdateRecipeStepInput } from 'src/recipes/inputs/recipe-step/update-recipe-step.input'
import { UpdateRecipeInput } from 'src/recipes/inputs/recipe/update-recipe.input'

export function buildRecipePatch(input: UpdateRecipeInput): Prisma.RecipeUpdateInput {
	// Only include fields that were provided
	const data: Prisma.RecipeUpdateInput = {}

	if (input.slug !== undefined) data.slug = input.slug
	if (input.title !== undefined) data.title = input.title
	if (input.description !== undefined) data.description = input.description
	if (input.difficulty !== undefined) data.difficulty = input.difficulty
	if (input.calories !== undefined) data.calories = input.calories
	if (input.cookingTime !== undefined) data.cookingTime = input.cookingTime

	// NOTE: author is intentionally NOT updatable
	return data
}

export function buildIngredientPatch(
	ing: UpdateRecipeIngredientInput
): Prisma.RecipeIngredientUpdateManyMutationInput {
	const data: Prisma.RecipeIngredientUpdateManyMutationInput = {}

	if (ing.quantity !== undefined) data.quantity = ing.quantity
	if (ing.recipeUnit !== undefined) data.recipeUnit = ing.recipeUnit
	if (ing.note !== undefined) data.note = ing.note

	return data
}

export function buildStepPatch(
	step: UpdateRecipeStepInput
): Prisma.RecipeStepUpdateManyMutationInput {
	const data: Prisma.RecipeStepUpdateManyMutationInput = {}

	if (step.stepNumber !== undefined) data.stepNumber = step.stepNumber
	if (step.title !== undefined) data.title = step.title
	if (step.description !== undefined) data.description = step.description

	return data
}

export function normalizeTags(tags: string[]): string[] {
	return [...new Set(tags.map(t => t.trim()).filter(Boolean))]
}
