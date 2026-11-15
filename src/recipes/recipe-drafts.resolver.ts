import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { CreateRecipeDraftInput } from './inputs/recipe/create-recipe.input'
import { RecipeDraftModel } from './models/recipe-draft.model'
import { RecipesService } from './recipes.service'

@Resolver(() => RecipeDraftModel)
export class RecipeDraftsResolver {
	constructor(private readonly recipesService: RecipesService) {}

	//* ----------------------------- Create Draft -----------------------------

	@Mutation(() => RecipeDraftModel)
	@Auth()
	createRecipeDraft(
		@CurrentUser('userId') userId: string,
		@Args('input') input: CreateRecipeDraftInput
	) {
		return this.recipesService.createRecipeDraft(userId, input)
	}
}
