import { ConsoleLogger, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'prisma/generated/client'
import { isDev } from 'src/utils/isDev.util'

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
		try {
			await this.$connect()
			await this.$queryRaw`SELECT 1`
			this.logger.log('✅ Prisma really connected to PostgreSQL')
		} catch (e) {
			this.logger.error(
				isDev(this.configService)
					? '❌ DB connection error; check if graphQL service started'
					: '❌ DB connection error',
				e instanceof Error ? e.message || e.stack : undefined
			)
			process.exit(1)
		}
	}
	async onModuleDestroy() {
		await this.$disconnect()
		this.logger.log('❌ Prisma disconnected from PostgreSQL')
	}
}
