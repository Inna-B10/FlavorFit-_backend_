import { Resolver } from '@nestjs/graphql';
import { IngredientsService } from './ingredients.service';

@Resolver()
export class IngredientsResolver {
  constructor(private readonly ingredientsService: IngredientsService) {}
}
