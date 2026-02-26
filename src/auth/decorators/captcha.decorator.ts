import { UseGuards } from '@nestjs/common'
import { GqlTurnstileGuard } from '../guards/gql-turnstile.guard'

export const VerifyCaptcha = () => UseGuards(GqlTurnstileGuard)
