import { BadRequestException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/prisma/client'
import { rethrowPrismaKnownErrors } from 'src/utils/prisma-errors'

export async function getRecipeIngredients(tx: Prisma.TransactionClient, recipeId: string) {
	try {
		const recipe = await tx.recipe.findUniqueOrThrow({
			where: { recipeId },
			select: {
				recipeId: true,
				ingredientsVersion: true,
				ingredients: {
					select: {
						quantity: true,
						recipeUnit: true,
						note: true,
						productId: true
					}
				}
			}
		})
		if (recipe.ingredients.length === 0) {
			throw new BadRequestException('Recipe has no ingredients')
		}
		return recipe
	} catch (e) {
		rethrowPrismaKnownErrors(e, { notFound: { type: 'recipe', id: recipeId } })
	}
}
