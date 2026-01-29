import { ConsoleLogger, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'prisma/generated/prisma/client'

@Injectable()
export class PrismaService extends PrismaClient {
	constructor(
		private readonly configService: ConfigService,
		private readonly logger: ConsoleLogger
	) {
		const connectionString = configService.get<string>('DATABASE_URL')

		if (!connectionString) {
			throw new Error('DATABASE_URL is not defined')
		}

		const adapter = new PrismaPg({
			connectionString
		})

		super({ adapter, log: ['error', 'warn'] })
	}
	async onModuleInit() {
		await this.$connect()
		this.logger.log('✅ Prisma connected to PostgreSQL')
	}

	async onModuleDestroy() {
		await this.$disconnect()
		this.logger.log('❌ Prisma disconnected from PostgreSQL')
	}
}
