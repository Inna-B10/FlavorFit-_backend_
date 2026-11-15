import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { AdminRecipesService } from './admin-recipes.service'
import { ReactionsModule } from './reactions/reactions.module'
import { RecipeDraftsResolver } from './recipe-drafts.resolver'
import { RecipesResolver } from './recipes.resolver'
import { RecipesService } from './recipes.service'

@Module({
	providers: [RecipesResolver, RecipeDraftsResolver, RecipesService, AdminRecipesService],
	imports: [PrismaModule, ReactionsModule]
})
export class RecipesModule {}
