import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config'
import { PrismaModule } from 'src/prisma/prisma.module'
import { UsersService } from 'src/users/users.service'
import { UserModel } from './auth.interface'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'

@Module({
	imports: [
		PrismaModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig
		}),
		UserModel
	],
	providers: [AuthService, AuthResolver, UsersService]
})
export class AuthModule {}
