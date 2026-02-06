import { Module } from '@nestjs/common'
import { AdminRecipesService } from './admin-recipes.service'
import { RecipeIngredientsModule } from './recipe-ingredients/recipe-ingredients.module'
import { RecipesResolver } from './recipes.resolver'
import { RecipesService } from './recipes.service'

@Module({
	providers: [RecipesResolver, RecipesService, AdminRecipesService],
	imports: [RecipeIngredientsModule]
})
export class RecipesModule {}
