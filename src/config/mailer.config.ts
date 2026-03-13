import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { isDev } from 'src/utils/isDev.util'

export const getMailerConfig = (configService: ConfigService): MailerOptions => ({
	transport: {
		host: configService.getOrThrow<string>('SMTP_SERVER'),
		port: isDev(configService) ? 587 : 465,
		secure: !isDev(configService),
		auth: {
			user: configService.getOrThrow<string>('SMTP_LOGIN'),
			pass: configService.getOrThrow<string>('SMTP_PASSWORD')
		}
	},
	defaults: {
		from: configService.getOrThrow<string>('MAIL_FROM')
	}
})
