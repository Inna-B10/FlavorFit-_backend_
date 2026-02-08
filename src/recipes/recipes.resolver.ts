import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { Role } from 'src/graphql/graphql.enums'
import { AdminRecipesService } from './admin-recipes.service'
import { CreateRecipeInput } from './inputs/recipe/create-recipe.input'
import { UpdateRecipeInput } from './inputs/recipe/update-recipe.input'
import { RecipeModel } from './models/recipe.model'
import { RecipesService } from './recipes.service'

@Resolver(() => RecipeModel)
export class RecipesResolver {
	constructor(
		private readonly recipesService: RecipesService,
		private readonly adminRecipesService: AdminRecipesService
	) {}

	//* --------------------------- All Recipes - User --------------------------- */
	@Query(() => [RecipeModel], { name: 'allRecipes' })
	getAllRecipes() {
		return this.recipesService.getAllRecipes()
	}

	@ResolveField(() => Int)
	likesCount(@Parent() recipe: { _count?: { likes?: number } }): number {
		// likes count is resolved from Prisma _count
		return recipe._count?.likes ?? 0
	}

	//* ------------------------------- By Slug - User --------------------------- */
	@Query(() => RecipeModel, { name: 'recipeBySlug' })
	getRecipeBySlug(@Args('slug') slug: string) {
		return this.recipesService.getRecipeBySlug(slug)
	}

	//* --------------------------- All Recipes - Admin -------------------------- */
	@Query(() => [RecipeModel], { name: 'adminAllRecipes' })
	@Auth(Role.ADMIN)
	getAllRecipesAdmin() {
		return this.adminRecipesService.getAllRecipes()
	}

	//* ------------------------------ By Id - Admin ----------------------------- */
	@Query(() => RecipeModel, { name: 'adminRecipeById' })
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
	@Mutation(() => RecipeModel)
	@Auth(Role.ADMIN)
	updateRecipe(@Args('recipeId') recipeId: string, @Args('input') input: UpdateRecipeInput) {
		return this.adminRecipesService.updateRecipe(recipeId, input)
	}

	//* --------------------------------- Delete --------------------------------- */
	@Mutation(() => RecipeModel)
	@Auth(Role.ADMIN)
	deleteRecipe(@Args('recipeId') recipeId: string) {
		return this.adminRecipesService.deleteRecipe(recipeId)
	}
}
