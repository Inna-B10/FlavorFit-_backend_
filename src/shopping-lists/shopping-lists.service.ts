import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { rethrowPrismaKnownErrors } from 'src/utils/prisma-errors'
import { applyIngredientsToShoppingList } from './helpers/apply-ingredients-to-shopping-list.helper'
import { getRecipeIngredients } from './helpers/recipe-ingredients.helper'

@Injectable()
export class ShoppingListsService {
	constructor(private readonly prisma: PrismaService) {}

	//* ---------------------------- All ShoppingLists --------------------------- */
	async getAllShoppingLists() {
		return this.prisma.shoppingList.findMany({ include: { listItems: true } })
	}

	//* --------------------------------- By User Id --------------------------------- */
	async getShoppingListByUserId(userId: string) {
		return this.prisma.shoppingList.findUnique({
			where: { userId },
			include: { listItems: true }
		})
	}

	//* ----------------------- Add Recipe To ShoppingList ----------------------- */
	async addRecipeToShoppingList(listId: string, recipeId: string) {
		return this.prisma.$transaction(async tx => {
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
		})
	}
}
