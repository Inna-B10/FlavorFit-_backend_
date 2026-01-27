import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { hash, verify } from 'argon2'
import { Response } from 'express'
import { PrismaService } from 'src/prisma/prisma.service'
import { UsersService } from 'src/users/users.service'
import { isDev } from 'src/utils/isDev.util'
import { AuthInput } from './auth.input'
import { IAuthTokenData } from './auth.interface'

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private configService: ConfigService,
		private jwt: JwtService,
		private usersService: UsersService
	) {}

	private EXPIRE_DAY_REFRESH_TOKEN = 3
	REFRESH_TOKEN_COOKIE_NAME = 'refreshToken'

	//* ------------------------------ Generate Tokens --------------------------- */
	private generateTokens(data: IAuthTokenData) {
		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		})
		const refreshToken = this.jwt.sign(
			{ userId: data.userId },
			{
				expiresIn: `${this.EXPIRE_DAY_REFRESH_TOKEN}d`
			}
		)
		return {
			accessToken,
			refreshToken
		}
	}

	//* ---------------------- Add/Remove Refresh Token Cookie ---------------------- */
	toggleRefreshTokenCookie(res: Response, refreshToken: string | null) {
		const isRemoveCookie = !refreshToken

		if (isRemoveCookie) {
			res.clearCookie(this.REFRESH_TOKEN_COOKIE_NAME)
			return
		}

		const expiresIn = new Date(Date.now() + this.EXPIRE_DAY_REFRESH_TOKEN * 24 * 60 * 60 * 1000)

		// const expiresIn = isRemoveCookie
		// 	? new Date(0)
		// 	: new Date(Date.now() + this.EXPIRE_DAY_REFRESH_TOKEN * 24 * 60 * 60 * 1000)

		res.cookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken || '', {
			httpOnly: true,
			expires: expiresIn,
			sameSite: isDev(this.configService) ? 'none' : 'strict',
			secure: !isDev(this.configService)
			//domain:... really needed only if there are multiple subdomains and the cookie must be shared
			// domain: isDev(this.configService) ? 'localhost' : '...',
		})
	}

	//* ------------------------------ Validate User ----------------------------- */
	private async validateUser(input: AuthInput) {
		const email = input.email.toLowerCase()
		const user = await this.usersService.findByEmail(email)

		if (!user) {
			throw new NotFoundException('Invalid email or password')
		}

		const isValidPassword = await verify(user.password, input.password)

		if (!isValidPassword) {
			throw new NotFoundException('Invalid email or password')
		}

		return user
	}

	//* ------------------------------ Registration ------------------------------ */
	async register(input: AuthInput) {
		try {
			const email = input.email.toLowerCase()
			const existingUser = await this.prisma.user.findFirst({
				where: { email: { equals: email, mode: 'insensitive' } }
			})
			if (existingUser) {
				throw new BadRequestException('User with this email already exists')
			}

			const user = await this.prisma.user.create({
				data: {
					email,
					password: await hash(input.password)
				}
			})

			const tokens = this.generateTokens({
				userId: user.userId,
				role: user.role
			})

			return { user, ...tokens }
		} catch (error) {
			throw new BadRequestException('Registration failed: ' + error)
		}
	}

	//* ---------------------------------- Login --------------------------------- */
	async login(input: AuthInput) {
		try {
			const user = await this.validateUser(input)
			const tokens = this.generateTokens({
				userId: user.userId,
				role: user.role
			})
			return { user, ...tokens }
		} catch (error) {
			throw new NotFoundException(error || 'Invalid email or password')
		}
	}

	//* --------------------------------- Logout --------------------------------- */
	// logout(@Context() { res }: IGqlContext) {
	// 	this.toggleRefreshTokenCookie(res, null)
	// }
}
