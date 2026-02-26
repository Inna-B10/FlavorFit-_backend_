import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { isDev } from 'src/utils/isDev.util'

export const getMailerConfig = (configService: ConfigService): MailerOptions => ({
	transport: {
		host: configService.get<string>('SMTP_SERVER'),
		port: isDev(configService) ? 587 : 465,
		secure: !isDev(configService),
		auth: {
			user: configService.get<string>('SMTP_LOGIN'),
			pass: configService.get<string>('SMTP_PASSWORD')
		}
	},
	defaults: {
		from: configService.get<string>('MAIL_FROM')
	}
})
