import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesResolver } from './recipes.resolver';
import { IngredientsModule } from './ingredients/ingredients.module';

@Module({
  providers: [RecipesResolver, RecipesService],
  imports: [IngredientsModule],
})
export class RecipesModule {}
