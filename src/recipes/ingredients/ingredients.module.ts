import { Module } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientsResolver } from './ingredients.resolver';

@Module({
  providers: [IngredientsResolver, IngredientsService],
})
export class IngredientsModule {}
