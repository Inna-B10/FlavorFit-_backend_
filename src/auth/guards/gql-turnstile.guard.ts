import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlExecutionContext } from '@nestjs/graphql'
import { TurnstileService } from 'nest-cloudflare-turnstile/dist/services/turnstile.service'
import { IGqlContext } from 'src/app.interface'

interface ITurnstileResponse {
	success: boolean
	challenge_ts?: string
	hostname?: string
	errorCodes?: string[]
	action?: string
	cdata?: string
}

@Injectable()
export class GqlTurnstileGuard implements CanActivate {
	constructor(
		private readonly turnstileService: TurnstileService,
		private readonly configService: ConfigService,
		@Inject('TurnstileServiceOptions')
		private readonly options: { secretKey: string }
	) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const gqlContext = GqlExecutionContext.create(context)
		const request = gqlContext.getContext<IGqlContext>().req

		//[TODO] add dev mode after testing
		// if (isDev(this.configService)) return true

		const token = request?.headers?.['cf-turnstile-token'] as string

		if (!token) {
			throw new BadRequestException('Captcha token is missing')
		}
		const { success } = (await this.turnstileService.validateToken(token)) as ITurnstileResponse

		if (!success) {
			throw new BadRequestException('Invalid captcha token')
		}

		return true
	}
}
