import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'prisma/generated/prisma/client'

@Injectable()
export class PrismaService extends PrismaClient {
	// check
	async $healthcheck() {
		await this.$queryRaw`SELECT 1`
	}

	constructor(private readonly configService: ConfigService) {
		const connectionString = process.env.DATABASE_URL

		const adapter = new PrismaPg({
			connectionString
		})

		super({ adapter, log: ['error', 'warn'] })
	}
	async onModuleInit() {
		await this.$connect()

		// check
		await this.$healthcheck()
		console.log('✅ Prisma connected and queryable')
	}

	async onModuleDestroy() {
		await this.$disconnect()
		console.log('❌ Prisma disconnected from PostgreSQL')
	}
}
