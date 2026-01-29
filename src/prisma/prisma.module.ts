import { ConsoleLogger, Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Module({
	providers: [PrismaService, ConsoleLogger],
	exports: [PrismaService]
})
export class PrismaModule {}
