import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	//NB! CORS-configuration is needed to work with https://studio.apollographql.com/sandbox/explorer
	// app.enableCors({
	// 	origin: true,
	// 	credentials: true
	// })
	await app.listen(process.env.PORT ?? 4200)
}
bootstrap()
