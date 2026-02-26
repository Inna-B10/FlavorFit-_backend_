import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { hash, verify } from 'argon2'
import { randomUUID } from 'crypto'
import { Response } from 'express'
import { EmailService } from 'src/email/email.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { UsersService } from 'src/users/users.service'
import { isDev } from 'src/utils/isDev.util'
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

	private readonly EXPIRE_DAYS_REFRESH_TOKEN = 3
	readonly REFRESH_TOKEN_COOKIE_NAME = 'refreshToken'

	private readonly ACCESS_EXPIRE_MINUTES = 1
	readonly ACCESS_TOKEN_COOKIE_NAME = 'accessToken'

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
			const link = `${frontendUrl}/auth/verify-email?token=${user.verificationToken}`
			//[TODO] remove it
			if (isDev(this.configService)) {
				console.log('[DEV] Verification link:', link)
				return { user }
			}

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
			role: freshUser.role
		})

		return { user: freshUser, ...tokens }
	}

	//* ---------------------------- Resend Verification ------------------------- */
	async resendVerification(email: string): Promise<boolean> {
		const normalizedEmail = email.toLowerCase()
		const user = await this.usersService.findUserByEmail(normalizedEmail)
		if (!user) return true

		if (!user.verificationToken) return true

		const newToken = randomUUID()
		await this.prisma.user.update({
			where: { userId: user.userId },
			data: {
				verificationToken: newToken
			}
		})

		const frontendUrl = this.configService.get<string>('FRONTEND_URL')
		const link = `${frontendUrl}/auth/verify-email?token=${user.verificationToken}`

		if (isDev(this.configService)) {
			console.log('[DEV] Verification link:', link)
			return true
		}

		await this.emailService.sendVerification(user.email, user.firstName, link)

		return true
	}

	//* ---------------------------------- Login --------------------------------- */
	async login(input: LoginInput) {
		try {
			const user = await this.validateUser(input)
			const tokens = this.generateTokens({
				userId: user.userId,
				role: user.role
			})
			return { user, ...tokens }
		} catch (e) {
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
			expiresIn: `${this.ACCESS_EXPIRE_MINUTES}m` //minutes
		})
		const refreshToken = this.jwt.sign(
			{ userId: data.userId },
			{
				expiresIn: `${this.EXPIRE_DAYS_REFRESH_TOKEN}d`
			}
		)
		return {
			accessToken,
			refreshToken
		}
	}

	//* ----------------------------- Get New Tokens ----------------------------- */
	async getNewTokens(refreshToken: string) {
		let payload: { userId: string }

		try {
			payload = await this.jwt.verifyAsync(refreshToken)
		} catch (e) {
			throw new BadRequestException('Invalid or expired refresh token')
		}
		const user = await this.usersService.findUserById(payload.userId)

		if (!user) {
			throw new NotFoundException('User not found')
		}

		const tokens = this.generateTokens({
			userId: user.userId,
			role: user.role
		})

		return { user, ...tokens }
	}

	//* ---------------------- Add/Remove Tokens Cookie ---------------------- */
	toggleAccessTokenCookie(res: Response, token: string | null) {
		this.toggleAuthTokenCookie({
			res,
			name: this.ACCESS_TOKEN_COOKIE_NAME,
			token,
			expires: new Date(Date.now() + this.ACCESS_EXPIRE_MINUTES * 60 * 1000) //minutes
		})
	}
	toggleRefreshTokenCookie(res: Response, token: string | null) {
		this.toggleAuthTokenCookie({
			res,
			name: this.REFRESH_TOKEN_COOKIE_NAME,
			token,
			expires: new Date(Date.now() + this.EXPIRE_DAYS_REFRESH_TOKEN * 24 * 60 * 60 * 1000) //days
		})
	}

	private toggleAuthTokenCookie({
		res,
		name,
		token,
		expires
	}: {
		res: Response
		name: AuthService['ACCESS_TOKEN_COOKIE_NAME'] | AuthService['REFRESH_TOKEN_COOKIE_NAME']
		token: string | null
		expires: Date
	}) {
		const isRemoveCookie = !token

		const expiresIn = isRemoveCookie ? new Date(0) : expires

		res.cookie(name, token || '', {
			httpOnly: true,
			expires: expiresIn,
			//# online
			// sameSite: 'none',
			// secure: true

			//# local
			sameSite: isDev(this.configService) ? 'lax' : 'none',
			secure: isDev(this.configService) ? false : true

			//domain:... really needed only if frontend and backend are in different SUBdomains and the cookie must be shared
			// domain: isDev(this.configService) ? 'localhost' : '...',
		})
	}
}
