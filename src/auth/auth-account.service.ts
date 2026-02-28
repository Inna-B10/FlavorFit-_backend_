import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { hash } from 'argon2'
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
	async resendVerification(email: string): Promise<boolean> {
		const normalizedEmail = email.toLowerCase()
		const user = await this.usersService.findUserByEmail(normalizedEmail)
		if (!user) return true

		if (!user.verificationToken) return true

		//NB! isDev
		const newToken = '0000'
		//const newToken = randomUUID()

		await this.prisma.user.update({
			where: { userId: user.userId },
			data: {
				verificationToken: newToken
			}
		})

		const verifyEmailLink = this.configService.getOrThrow<string>('FRONTEND_URL')

		//NB! isDev
		const link = `${verifyEmailLink}/auth/verify-email?token=${newToken}`
		//const link = `${verifyEmailLink}/auth/verify-email?token=${user.verificationToken}`

		//NB! isDev
		if (isDev(this.configService)) {
			console.log('[DEV] Verification link:', link)
			return true
		}

		await this.emailService.sendVerification(user.email, user.firstName, link)

		return true
	}

	//* ---------------------------- Request Password Reset ------------------------- */
	async requestPasswordReset(email: string) {
		const normalizedEmail = email.toLowerCase()
		const user = await this.usersService.findUserByEmail(normalizedEmail)
		if (!user) return true

		//NB! isDev
		const newResetPasswordToken = '0000'
		//const newResetPasswordToken = randomUUID()

		await this.prisma.user.update({
			where: { userId: user.userId },
			data: {
				resetPasswordToken: newResetPasswordToken,
				resetPasswordTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 1) // 1 minutes
			}
		})

		//NB! isDev
		const resetPasswordLink = `${this.configService.getOrThrow<string>('FRONTEND_URL')}/auth/reset-password?token=${newResetPasswordToken}`
		//const resetPasswordLink = `${this.configService.getOrThrow<string>('FRONTEND_URL')}/auth/reset-password?token=${user.resetPasswordToken}`

		//NB! isDev
		if (isDev(this.configService)) {
			console.log('[DEV] Reset password link:', resetPasswordLink)
			return true
		}

		await this.emailService.sendResetPassword(user.email, user.firstName, resetPasswordLink)

		return true
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
