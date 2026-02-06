import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/prisma/prisma.module'
import { ReactionsResolver } from './reactions.resolver'
import { ReactionsService } from './reactions.service'

@Module({
	providers: [ReactionsResolver, ReactionsService],
	imports: [PrismaModule]
})
export class ReactionsModule {}
