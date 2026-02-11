import { Prisma } from 'prisma/generated/client'
import { CreateRecipeInput } from 'src/recipes/inputs/recipe/create-recipe.input'
import { UpdateRecipeInput } from 'src/recipes/inputs/recipe/update-recipe.input'

//* ------------------------------ Has Nutrition ------------------------------ */
export function hasNutrition(nutritionFacts?: object | null): boolean {
	if (!nutritionFacts) return false
	return Object.values(nutritionFacts).some(v => v !== null && v !== undefined)
}

//* --------------------------- Build Nutrition Data --------------------------- */
// For create (nested create)
export function buildNutritionData(nutritionFacts?: CreateRecipeInput['nutritionFacts']) {
	if (!hasNutrition(nutritionFacts)) return undefined
	return { create: nutritionFacts }
}

//* -------------------------- Upsert Nutrition Facts -------------------------- */
export async function upsertNutritionFacts(
	tx: Prisma.TransactionClient,
	recipeId: string,
	nutritionFacts?: UpdateRecipeInput['nutritionFacts']
): Promise<void> {
	if (nutritionFacts === undefined) return // not provided => do nothing
	if (!hasNutrition(nutritionFacts)) return // treat empty object as "do nothing"

	await tx.nutritionFact.upsert({
		where: { recipeId },
		create: { recipeId, ...nutritionFacts },
		update: { ...nutritionFacts }
	})
}
