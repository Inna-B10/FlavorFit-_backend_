import { Prisma } from 'prisma/generated/prisma/client'
import { rethrowPrismaKnownErrors } from 'src/utils/prisma-errors'

import { applyIngredientsToShoppingList, getRecipeIngredients } from './list-ingredients.helper'

//* ----------------------------- Check If Exists ---------------------------- */
export async function checkIfRecipeInList(
	tx: Prisma.TransactionClient,
	listId: string,
	recipeId: string
) {
	try {
		await tx.shoppingListRecipe.findUniqueOrThrow({
			where: {
				listId_recipeId: {
					listId,
					recipeId
				}
			},
			select: { listRecipeId: true }
		})
	} catch (e) {
		rethrowPrismaKnownErrors(e, {
			notFound: { type: 'custom', message: 'Recipe is not added to this shopping list' }
		})
	}
}

//* ----------------------- Add Recipe To Shopping List ---------------------- */
export async function addRecipeToShoppingList(
	tx: Prisma.TransactionClient,
	listId: string,
	recipeId: string
) {
	//1. check if recipe AND ingredients exist, and return them
	const recipe = await getRecipeIngredients(tx, recipeId)

	//2. prevent adding the same recipe twice, if already exists -> throw BadRequestException
	await tx.shoppingListRecipe
		.create({
			data: {
				listId,
				recipeId
			}
		})
		.catch(e => rethrowPrismaKnownErrors(e))

	//3. apply ingredients: upsert item + create source + increment requiredAmount
	await applyIngredientsToShoppingList(tx, { listId, recipeId, recipe })

	//4. return updated list
	return tx.shoppingList.findUnique({
		where: { listId },
		include: {
			recipes: {
				include: {
					recipe: true
				}
			},
			listItems: {
				include: {
					product: true,
					sources: { include: { recipe: true } }
				}
			}
		}
	})
}
