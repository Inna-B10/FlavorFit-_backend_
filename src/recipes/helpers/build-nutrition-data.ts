import { CreateRecipeInput } from 'src/recipes/inputs/recipe/create-recipe.input'

export function buildNutritionData(nutritionFacts?: CreateRecipeInput['nutritionFacts']) {
	if (!nutritionFacts) return undefined

	const hasAny = Object.values(nutritionFacts).some(v => v !== null && v !== undefined)
	if (!hasAny) return undefined

	return { create: nutritionFacts }
}
