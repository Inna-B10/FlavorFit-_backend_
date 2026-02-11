import { Prisma } from 'prisma/generated/client'
import { UpdateRecipeInput } from 'src/recipes/inputs/recipe/update-recipe.input'

//* ---------------------------- Build Recipe Patch ---------------------------- */
export function buildRecipePatch(
	input: UpdateRecipeInput,
	shouldBumpIngredientsVersion?: boolean
): Prisma.RecipeUpdateInput {
	const data: Prisma.RecipeUpdateInput = {}

	if (input.slug !== undefined) data.slug = input.slug
	if (input.title !== undefined) data.title = input.title
	if (input.description !== undefined) data.description = input.description
	if (input.difficulty !== undefined) data.difficulty = input.difficulty
	if (input.calories !== undefined) data.calories = input.calories
	if (input.cookingTime !== undefined) data.cookingTime = input.cookingTime
	if (shouldBumpIngredientsVersion) data.ingredientsVersion = { increment: 1 }
	return data
}

//* ----------------------------- Patch Recipe Core ---------------------------- */
export async function patchRecipeCore(
	tx: Prisma.TransactionClient,
	recipeId: string,
	input: UpdateRecipeInput,
	shouldBumpIngredientsVersion: boolean = false
): Promise<void> {
	const patch = buildRecipePatch(input, shouldBumpIngredientsVersion)
	if (!Object.keys(patch).length) return

	await tx.recipe.update({
		where: { recipeId },
		data: patch
	})
}
