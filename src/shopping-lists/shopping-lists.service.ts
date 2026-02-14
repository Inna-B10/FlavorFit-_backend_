import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import {
	applyIngredientsToShoppingList,
	deleteIngredientsFromList,
	getRecipeIngredients
} from './helpers/list-ingredients.helper'
import { addRecipeToShoppingList, checkIfRecipeInList } from './helpers/list-recipe.helper'
import {
	deleteOldSourcesForRecipe,
	findAllSourcesForRecipe,
	subtractRecipeSourcesFromListItems
} from './helpers/list-sources.helper'
import { getOrCreateShoppingList, getUpdatedShoppingList } from './helpers/shopping-list.helper'

@Injectable()
export class ShoppingListsService {
	constructor(private readonly prisma: PrismaService) {}

	//* --------------------------------- By User Id --------------------------------- */
	async getShoppingListByUserId(userId: string) {
		const shoppingList = await this.prisma.shoppingList.findUnique({
			where: { userId },
			include: { listItems: true }
		})

		if (!shoppingList) {
			throw new NotFoundException('Shopping list not found')
		}
		return shoppingList
	}

	//* ----------------------- Add Recipe To ShoppingList ----------------------- */
	async addRecipeToMyShoppingList(userId: string, recipeId: string) {
		return this.prisma.$transaction(async tx => {
			const { listId } = await getOrCreateShoppingList(tx, userId)

			return addRecipeToShoppingList(tx, listId, recipeId)
		})
	}

	//* --------------------- Update Recipe In ShoppingList --------------------- */
	async refreshRecipeInShoppingList(listId: string, recipeId: string) {
		return this.prisma.$transaction(async tx => {
			//1. check if recipe exists in this shopping list
			await checkIfRecipeInList(tx, listId, recipeId)

			//2. find all sources for this recipe
			const sources = await findAllSourcesForRecipe(tx, { listId, recipeId })

			//3. subtract the old contributions from aggregated items
			await subtractRecipeSourcesFromListItems(tx, sources)

			//4. delete old sources for this recipe
			await deleteOldSourcesForRecipe(tx, recipeId, listId)

			//5. delete from shopping list items without sources
			await deleteIngredientsFromList(tx, listId)

			//6. rebuild sources/items from the CURRENT recipe ingredients
			const recipe = await getRecipeIngredients(tx, recipeId)
			await applyIngredientsToShoppingList(tx, { listId, recipeId, recipe })

			//7. touch ShoppingListRecipe.updatedAt
			await tx.shoppingListRecipe.update({
				where: { listId_recipeId: { listId, recipeId } },
				data: { updatedAt: new Date() }
			})

			//8. return updated list
			return getUpdatedShoppingList(tx, listId)
		})
	}

	//* -------------------- Delete Recipe From Shopping List -------------------- */
	async removeRecipeFromShoppingList(listId: string, recipeId: string) {
		return this.prisma.$transaction(async tx => {
			//1. check if recipe exists in the shopping list
			await checkIfRecipeInList(tx, listId, recipeId)

			//2. find all sources for this recipe in this list
			const sources = await findAllSourcesForRecipe(tx, { listId, recipeId })

			//3. subtract contribution from aggregated items
			await subtractRecipeSourcesFromListItems(tx, sources)

			//4. delete old sources for this recipe
			await deleteOldSourcesForRecipe(tx, recipeId, listId)

			//5. delete from shopping list items without sources
			await deleteIngredientsFromList(tx, listId)

			//6. remove recipe link
			await tx.shoppingListRecipe.delete({
				where: {
					listId_recipeId: { listId, recipeId }
				}
			})

			//7. return updated list
			return getUpdatedShoppingList(tx, listId)
		})
	}

	//* ---------------------------- All ShoppingLists --------------------------- */
	async getAllShoppingLists() {
		return this.prisma.shoppingList.findMany({ include: { listItems: true } })
	}
}
