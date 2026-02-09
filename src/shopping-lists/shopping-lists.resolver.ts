import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { type RecipeInShoppingListInput } from './inputs/recipe-in-shopping-list.input'
import { ShoppingListModel } from './models/shopping-list.model'
import { ShoppingListsService } from './shopping-lists.service'

type TListForOutdatedFlag = {
	recipes: Array<{ recipeId: string; recipe: { ingredientsVersion: number } }>
	listItems: Array<{
		sources: Array<{ recipeId: string; ingredientsVersionUsed: number }>
	}>
}

@Resolver(() => ShoppingListModel)
export class ShoppingListsResolver {
	constructor(private readonly shoppingListsService: ShoppingListsService) {}

	//* --------------------------- HasOutdatedRecipes --------------------------- */
	@ResolveField(() => Boolean)
	hasOutdatedRecipes(@Parent() list: TListForOutdatedFlag): boolean {
		const currentVersionByRecipeId = new Map<string, number>()
		for (const lr of list.recipes ?? []) {
			currentVersionByRecipeId.set(lr.recipeId, lr.recipe.ingredientsVersion ?? 1)
		}

		for (const item of list.listItems ?? []) {
			for (const src of item.sources ?? []) {
				const current = currentVersionByRecipeId.get(src.recipeId)
				if (current !== undefined && current > (src.ingredientsVersionUsed ?? 1)) {
					return true
				}
			}
		}

		return false
	}

	//* --------------------- Update Recipe In Shopping List --------------------- */
	@Mutation(() => ShoppingListModel)
	refreshRecipeInShoppingList(@Args('input') input: RecipeInShoppingListInput) {
		return this.shoppingListsService.refreshRecipeInShoppingList(input.listId, input.recipeId)
	}

	//* -------------------- Delete Recipe From Shopping List -------------------- */
	@Mutation(() => ShoppingListModel)
	removeRecipeFromShoppingList(@Args('input') input: RecipeInShoppingListInput) {
		return this.shoppingListsService.removeRecipeFromShoppingList(input.listId, input.recipeId)
	}
}
