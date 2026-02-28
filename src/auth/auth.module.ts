import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { PrismaModule } from 'src/prisma/prisma.module'

import { PassportModule } from '@nestjs/passport'
import { EmailModule } from 'src/email/email.module'
import { UsersModule } from 'src/users/users.module'
import { AuthAccountService } from './auth-account.service'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
	imports: [
		PrismaModule,
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		}),
		UsersModule,
		EmailModule
	],
	providers: [AuthService, AuthResolver, JwtStrategy, AuthAccountService]
})
export class AuthModule {}
