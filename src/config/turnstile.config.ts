import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { ITurnstileOptions } from 'nest-cloudflare-turnstile'

export const getTurnstileConfig = (configService: ConfigService): ITurnstileOptions => {
	const secretKey = configService.getOrThrow<string>('CLOUDFLARE_TURNSTILE_SECRET_KEY')

	return { secretKey, tokenResponse: (req: Request) => req.headers['cf-turnstile-token'] as string }
}
