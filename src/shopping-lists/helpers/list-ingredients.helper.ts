import { BadRequestException } from '@nestjs/common'
import Decimal from 'decimal.js'
import { Prisma, RecipeUnit } from 'prisma/generated/client'
import { rethrowPrismaKnownErrors } from 'src/common/prisma/prisma-errors'

type TRecipeIngredientsPayload = {
	ingredientsVersion: number
	ingredients: Array<{
		productId: string
		quantity: Decimal
		recipeUnit: RecipeUnit
		ingredientNote: string | null
	}>
}

//* --------------------------- Get Recipe Ingredients --------------------------- */
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
						ingredientNote: true,
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

//* --------------------------- Apply Ingredients To List --------------------------- */
export async function applyIngredientsToShoppingList(
	tx: Prisma.TransactionClient,
	params: {
		listId: string
		recipeId: string
		recipe: TRecipeIngredientsPayload
	}
): Promise<void> {
	const { listId, recipeId, recipe } = params

	for (const ing of recipe.ingredients) {
		// upsert aggregated list item (unique: [listId, productId, recipeUnit])
		const listItem = await tx.shoppingListItem.upsert({
			where: {
				listId_productId_recipeUnit: {
					listId,
					productId: ing.productId,
					recipeUnit: ing.recipeUnit
				}
			},
			create: {
				listId,
				productId: ing.productId,
				recipeUnit: ing.recipeUnit,
				requiredAmount: ing.quantity,
				isChecked: false
			},
			update: {
				requiredAmount: { increment: ing.quantity }
			},
			select: { listItemId: true }
		})

		// create source snapshot (unique: [listItemId, recipeId])
		await tx.shoppingListItemSource.create({
			data: {
				listItemId: listItem.listItemId,
				recipeId,
				ingredientsVersionUsed: recipe.ingredientsVersion,
				amount: ing.quantity,
				recipeUnit: ing.recipeUnit,
				ingredientNote: ing.ingredientNote ?? null
			}
		})
	}
}

//* --------------------------- Delete Ingredients From List --------------------------- */
export async function deleteIngredientsFromList(tx: Prisma.TransactionClient, listId: string) {
	await tx.shoppingListItem.deleteMany({
		where: {
			listId,
			sources: { none: {} }
		}
	})
}
