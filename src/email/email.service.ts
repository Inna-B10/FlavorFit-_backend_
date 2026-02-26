import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { render } from '@react-email/render'
import ResetPasswordEmail from './templates/reset-password'
import VerificationEmail from './templates/verification-email'

@Injectable()
export class EmailService {
	constructor(private readonly mailerService: MailerService) {}

	sendEmail(to: string, subject: string, html: string): Promise<void> {
		return this.mailerService.sendMail({
			to,
			subject,
			html
		})
	}

	async sendVerification(to: string, userName: string, verificationLink: string) {
		const html = await render(VerificationEmail({ userName, url: verificationLink }))
		return await this.sendEmail(to, 'Please Verify Your Email Address', html)
	}
	async sendResetPassword(to: string, userName: string, resetLink: string) {
		const html = await render(ResetPasswordEmail({ userName, url: resetLink }))
		return await this.sendEmail(to, `Password Reset for ${process.env.APP_NAME}`, html)
	}
}
