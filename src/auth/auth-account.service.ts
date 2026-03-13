import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { hash } from 'argon2'
import { randomUUID } from 'crypto'
import { EmailService } from 'src/email/email.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { UsersService } from 'src/users/users.service'
import { isDev } from 'src/utils/isDev.util'
import { AuthService } from './auth.service'

@Injectable()
export class AuthAccountService {
	constructor(
		private prisma: PrismaService,
		private configService: ConfigService,
		private jwt: JwtService,
		private emailService: EmailService,
		private usersService: UsersService,
		private authService: AuthService
	) {}

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

		const tokens = this.authService.generateTokens({
			userId: freshUser.userId,
			role: freshUser.role
		})

		return { user: freshUser, ...tokens }
	}

	//* ---------------------------- Resend Verification ------------------------- */
	async resendVerification(email: string): Promise<string | null> {
		const normalizedEmail = email.toLowerCase()
		const user = await this.usersService.findUserByEmail(normalizedEmail)
		if (!user) return null //return true

		if (!user.verificationToken) return null //return true

		const newToken = randomUUID()

		await this.prisma.user.update({
			where: { userId: user.userId },
			data: {
				verificationToken: newToken
			}
		})

		const verifyEmailLink = this.configService.getOrThrow<string>('FRONTEND_URL')

		const link = `${verifyEmailLink}/auth/verify-email?token=${user.verificationToken}`

		try {
			await this.emailService.sendVerification(user.email, user.firstName, link)
		} catch (e) {
			if (isDev(this.configService)) {
				console.log(e)
			}
		}

		return link //return true
	}

	//* ---------------------------- Request Password Reset ------------------------- */
	async requestPasswordReset(email: string) {
		const normalizedEmail = email.toLowerCase()
		const user = await this.usersService.findUserByEmail(normalizedEmail)
		if (!user) return null //return true

		const newResetPasswordToken = randomUUID()

		//NB![DEV] 1 minute
		await this.prisma.user.update({
			where: { userId: user.userId },
			data: {
				resetPasswordToken: newResetPasswordToken,
				resetPasswordTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 1) // 1 minutes
			}
		})

		const resetPasswordLink = `${this.configService.getOrThrow<string>('FRONTEND_URL')}/auth/reset-password?token=${user.resetPasswordToken}`

		try {
			await this.emailService.sendResetPassword(user.email, user.firstName, resetPasswordLink)
		} catch (e) {
			if (isDev(this.configService)) {
				console.log(e)
			}
		}

		return resetPasswordLink //return true
	}

	//* ---------------------------- Validate Reset Token ------------------------- */
	async validateResetToken(token: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				resetPasswordToken: token,
				resetPasswordTokenExpiresAt: {
					gte: new Date()
				}
			}
		})

		return !!user
	}

	//* ---------------------------- Reset Password ------------------------- */
	async resetPassword(token: string, newPassword: string) {
		const user = await this.prisma.user.findFirst({
			where: {
				resetPasswordToken: token,
				resetPasswordTokenExpiresAt: {
					gte: new Date()
				}
			}
		})

		if (!user) throw new BadRequestException('Invalid or expired token!')

		await this.prisma.user.update({
			where: { userId: user.userId },
			data: {
				password: await hash(newPassword),
				resetPasswordToken: null,
				resetPasswordTokenExpiresAt: null
			}
		})

		return true
	}
}
