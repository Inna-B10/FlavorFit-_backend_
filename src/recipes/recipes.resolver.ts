import { Resolver } from '@nestjs/graphql';
import { RecipesService } from './recipes.service';

@Resolver()
export class RecipesResolver {
  constructor(private readonly recipesService: RecipesService) {}
}
