import { NotFoundException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/prisma/client'

//* --------------------------- Check Recipe Exists --------------------------- */
export async function checkRecipeExists(
	tx: Prisma.TransactionClient,
	recipeId: string
): Promise<void> {
	const exists = await tx.recipe.findUnique({
		where: { recipeId },
		select: { recipeId: true }
	})

	if (!exists) throw new NotFoundException(`Recipe with ID '${recipeId}' not found`)
}

//* ------------------------------ Get Recipe Full ----------------------------- */
export async function getRecipeFull(tx: Prisma.TransactionClient, recipeId: string) {
	const recipe = await tx.recipe.findUnique({
		where: { recipeId },
		include: {
			ingredients: { include: { product: true } },
			recipeSteps: true,
			tags: true,
			nutritionFacts: true
		}
	})

	if (!recipe) throw new NotFoundException(`Recipe with ID '${recipeId}' not found`)

	return recipe
}
