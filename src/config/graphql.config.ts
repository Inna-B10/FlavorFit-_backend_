import { ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigService } from '@nestjs/config'
import type { IGqlContext } from 'src/app.interface'
import { isDev } from 'src/utils/isDev.util'

export const getGraphQLConfig = (configService: ConfigService): ApolloDriverConfig => ({
	autoSchemaFile: true,
	sortSchema: true,
	playground: isDev(configService),
	context: ({ req, res }: IGqlContext): IGqlContext => ({ req, res })
})
