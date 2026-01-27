import { ConfigService } from '@nestjs/config'

export const isDev = (configService: ConfigService): boolean => {
	return configService.get<string>('MODE_ENV') === 'development'
}
