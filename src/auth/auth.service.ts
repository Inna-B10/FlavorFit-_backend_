import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { hash, verify } from 'argon2'
import { Response } from 'express'
import { EmailService } from 'src/email/email.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { UsersService } from 'src/users/users.service'
import type { IAuthTokenData } from './auth.interface'
import { LoginInput, RegisterInput } from './inputs/auth.input'

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private configService: ConfigService,
		private jwt: JwtService,
		private emailService: EmailService,
		private usersService: UsersService
	) {}

	private EXPIRE_DAY_REFRESH_TOKEN = 3
	REFRESH_TOKEN_COOKIE_NAME = 'refreshToken'

	//* ------------------------------ Registration ------------------------------ */
	async register(input: RegisterInput) {
		try {
			const normalizedEmail = input.email.toLowerCase()

			const existingUser = await this.usersService.findUserByEmail(normalizedEmail)

			if (existingUser) {
				throw new BadRequestException('User with this email already exists')
			}

			const hashedPassword = await hash(input.password)
			const user = await this.usersService.createUser(
				normalizedEmail,
				hashedPassword,
				input.firstName
			)

			const frontendUrl = this.configService.get<string>('FRONTEND_URL')
			const link = `${frontendUrl}/verify-email?token=${user.verificationToken}`

			await this.emailService.sendVerification(user.email, user.firstName, link)

			return { user }
			// return { userId: user.userId, email: user.email }
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unknown error'

			throw new BadRequestException(message)
		}
	}

	//* ------------------------------ Verify Email ------------------------------ */
	async verifyEmail(token: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				verificationToken: token
			}
		})

		if (!user) throw new NotFoundException('Invalid token!')

		if (user.verificationToken) {
			await this.prisma.user.update({
				where: { userId: user.userId },
				data: {
					verificationToken: null
				}
			})
		}

		const freshUser = await this.prisma.user.findUnique({
			where: { userId: user.userId }
		})
		if (!freshUser) throw new BadRequestException('User not found')

		const tokens = this.generateTokens({
			userId: freshUser.userId,
			role: freshUser.role,
			firstName: freshUser.firstName,
			avatarUrl: freshUser.avatarUrl
		})

		return { user: freshUser, ...tokens }
	}

	//* ---------------------------- Resend Verification ------------------------- */
	async resendVerification(email: string) {
		const user = await this.usersService.findUserByEmail(email)
		if (!user) {
			throw new NotFoundException('User not found')
		}

		if (!user.verificationToken) {
			throw new BadRequestException('User is already verified')
		}

		const frontendUrl = this.configService.get<string>('FRONTEND_URL')
		const link = `${frontendUrl}/verify-email?token=${user.verificationToken}`

		await this.emailService.sendVerification(user.email, user.firstName, link)

		return { message: 'Verification email resent' }
	}

	//* ---------------------------------- Login --------------------------------- */
	async login(input: LoginInput) {
		try {
			const user = await this.validateUser(input)
			const tokens = this.generateTokens({
				userId: user.userId,
				role: user.role,
				firstName: user.firstName,
				avatarUrl: user.avatarUrl
			})
			return { user, ...tokens }
		} catch (error) {
			throw new NotFoundException('Invalid email or password')
		}
	}

	//* ------------------------------ Validate User ----------------------------- */
	async validateUser(input: LoginInput) {
		const email = input.email.toLowerCase()
		const user = await this.usersService.findUserByEmail(email)

		if (!user) {
			throw new NotFoundException('Invalid email or password')
		}

		const isValidPassword = await verify(user.password, input.password)

		if (!isValidPassword) {
			throw new NotFoundException('Invalid email or password')
		}

		return user
	}

	//* ------------------------------ Generate Tokens --------------------------- */
	generateTokens(data: IAuthTokenData) {
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

	//* ----------------------------- Get New Tokens ----------------------------- */
	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync<Pick<IAuthTokenData, 'userId'>>(refreshToken)

		if (!result) {
			throw new BadRequestException('Invalid refresh token')
		}

		const user = await this.usersService.findUserById(result.userId)

		if (!user) {
			throw new NotFoundException('User not found')
		}

		const tokens = this.generateTokens({
			userId: user.userId,
			role: user.role,
			firstName: user.firstName,
			avatarUrl: user.avatarUrl
		})

		return { user, ...tokens }
	}

	//* ---------------------- Add/Remove Refresh Token Cookie ---------------------- */
	toggleRefreshTokenCookie(res: Response, refreshToken: string | null) {
		const isRemoveCookie = !refreshToken

		if (isRemoveCookie) {
			res.clearCookie(this.REFRESH_TOKEN_COOKIE_NAME)
			return
		}

		const expiresIn = new Date(Date.now() + this.EXPIRE_DAY_REFRESH_TOKEN * 24 * 60 * 60 * 1000) // 3 days

		res.cookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken || '', {
			httpOnly: true,
			expires: expiresIn,
			// sameSite: isDev(this.configService) ? 'lax' : 'none',
			sameSite: 'none',
			// secure: !isDev(this.configService)
			secure: true
			//domain:... really needed only if there are multiple subdomains and the cookie must be shared
			// domain: isDev(this.configService) ? 'localhost' : '...',
		})
	}
}
