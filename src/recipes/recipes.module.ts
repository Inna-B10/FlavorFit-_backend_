import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AdminRecipesService } from './admin-recipes.service'
import { RecipesResolver } from './recipes.resolver'
import { RecipesService } from './recipes.service'
import { ReactionsModule } from './reactions/reactions.module';

@Module({
	providers: [RecipesResolver, RecipesService, AdminRecipesService],
	imports: [PrismaModule, ReactionsModule]
})
export class RecipesModule {}
