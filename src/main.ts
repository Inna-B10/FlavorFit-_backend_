import { ConsoleLogger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module'

async function bootstrap() {
	const logger = new ConsoleLogger()

	const app = await NestFactory.create<NestExpressApplication>(AppModule)

	app.use(cookieParser())

	app.enableCors({
		origin: ['http://localhost:3000', 'http://localhost:3001'],
		credentials: true
		// allowedHeaders: ['Content-Type', 'Authorization']
	})

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true
		})
	)

	app.disable('x-powered-by')
	const port = process.env.PORT ?? 4200
	await app.listen(port)
	logger.log(`Server running on port ${port}`)
}
bootstrap()
