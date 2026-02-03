import { Module } from '@nestjs/common'
import { RecipeIngredientsResolver } from './recipe-ingredients.resolver'
import { RecipeIngredientsService } from './recipe-ingredients.service'

@Module({
	providers: [RecipeIngredientsResolver, RecipeIngredientsService]
})
export class RecipeIngredientsModule {}
