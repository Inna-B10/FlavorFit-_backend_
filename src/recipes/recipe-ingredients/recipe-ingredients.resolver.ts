import { Resolver } from '@nestjs/graphql'
import { RecipeIngredientsService } from './recipe-ingredients.service'

@Resolver()
export class RecipeIngredientsResolver {
	constructor(private readonly recipeIngredientsService: RecipeIngredientsService) {}
}
