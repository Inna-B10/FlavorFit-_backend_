import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { Role } from 'src/graphql/graphql.enums'
import { AdminRecipesService } from './admin-recipes.service'
import { CreateRecipeInput } from './inputs/recipe/create-recipe.input'
import { RecipeModel } from './models/recipe.model'
import { RecipesService } from './recipes.service'

@Resolver(() => RecipeModel)
export class RecipesResolver {
	constructor(
		private readonly recipesService: RecipesService,
		private readonly adminRecipesService: AdminRecipesService
	) {}

	@Query(() => [RecipeModel], { name: 'AllRecipes' })

	//* --------------------------- All Recipes - User --------------------------- */
	getAllRecipes() {
		return this.recipesService.getAllRecipes()
	}

	//* ------------------------------- By Slug - User --------------------------- */
	@Query(() => RecipeModel, { name: 'RecipeBySlug' })
	getRecipeBySlug(@Args('slug') slug: string) {
		return this.recipesService.getRecipeBySlug(slug)
	}

	//* --------------------------- All Recipes - Admin -------------------------- */
	@Query(() => [RecipeModel], { name: 'AdminAllRecipes' })
	@Auth(Role.ADMIN)
	getAllRecipesAdmin() {
		return this.adminRecipesService.getAllRecipes()
	}

	//* ------------------------------ By Id - Admin ----------------------------- */
	@Query(() => RecipeModel, { name: 'AdminRecipeById' })
	@Auth(Role.ADMIN)
	getRecipeById(@Args('recipeId') recipeId: string) {
		return this.adminRecipesService.getRecipeById(recipeId)
	}

	//* ----------------------------- Create ----------------------------- */
	@Mutation(() => RecipeModel)
	@Auth(Role.ADMIN)
	createRecipe(@CurrentUser('userId') userId: string, @Args('input') input: CreateRecipeInput) {
		return this.adminRecipesService.createRecipe(userId, input)
	}

	//* --------------------------------- Update --------------------------------- */

	// 	@Mutation(() => RecipeModel)
	// 	@Auth(Role.ADMIN)
	// 	updateRecipe(@Args('recipeId') recipeId: string, @Args('input') input: CreateRecipeInput) {
	// 		return this.adminRecipesService.updateRecipe(recipeId, input)
	// 	}
	//

	//* --------------------------------- Delete --------------------------------- */
	@Mutation(() => RecipeModel)
	@Auth(Role.ADMIN)
	deleteRecipe(@Args('recipeId') recipeId: string) {
		return this.adminRecipesService.deleteRecipe(recipeId)
	}
}
