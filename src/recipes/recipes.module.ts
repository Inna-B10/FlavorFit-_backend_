import { Module } from '@nestjs/common'
import { RecipeIngredientsModule } from './recipe-ingredients/recipe-ingredients.module'
import { RecipesResolver } from './recipes.resolver'
import { RecipesService } from './recipes.service'

@Module({
	providers: [RecipesResolver, RecipesService],
	imports: [RecipeIngredientsModule]
})
export class RecipesModule {}
