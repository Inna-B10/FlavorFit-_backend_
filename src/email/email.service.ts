import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/render'
import ResetPasswordEmail from './templates/reset-password'
import VerificationEmail from './templates/verification-email'

interface MailgunResponse {
	id: string
	message: string
}

@Injectable()
export class EmailService {
	constructor(private readonly configService: ConfigService) {}

	async sendEmail(
		to: string,
		subject: string,
		html: string,
		text?: string
	): Promise<MailgunResponse> {
		const apiKey = this.configService.get<string>('MAILGUN_API_KEY')
		const domain = this.configService.get<string>('MAILGUN_DOMAIN')
		const from = this.configService.get<string>('MAIL_FROM')

		const formData = new FormData()

		formData.append('from', from!)
		formData.append('to', to)
		formData.append('subject', subject)
		formData.append('html', html)
		formData.append('text', text || '')

		const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
			method: 'POST',
			headers: {
				Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`
			},
			body: formData
		})

		if (!res.ok) {
			const text = await res.text()
			throw new Error(`Mailgun error: ${text}`)
		}

		const result = (await res.json()) as MailgunResponse
		console.log('Mailgun message id:', result.id)
		return result
	}

	//* ---------------------------- Verify Email ------------------------------ */
	async sendVerification(to: string, userName: string, verificationLink: string) {
		const html = await render(VerificationEmail({ userName, url: verificationLink }))
		const text = `
Dear ${userName},

Thank you for joining us!

To complete registration please open this link:
${verificationLink}

Best regards,
${process.env.APP_NAME} team
  `
		return await this.sendEmail(to, 'Please Verify Your Email Address', html, text)
	}

	//* ---------------------------- Reset Password ------------------------- */
	async sendResetPassword(to: string, userName: string, resetLink: string) {
		const html = await render(ResetPasswordEmail({ userName, url: resetLink }))
		const text = `
Dear ${userName},

We have received a request to reset password for your ${process.env.APP_NAME} account. To ensure the
security of your account, we are sending you a verification email to reset your password.

To reset your password, please follow the instructions below:
1. Click on the link below to go to the password reset page:
${resetLink}
2. Enter your new password in the required field.
3. Click on the "Submit" button to confirm the new password.

Best regards,
${process.env.APP_NAME} team
	`
		return await this.sendEmail(to, `Password Reset for ${process.env.APP_NAME}`, html, text)
	}
}
