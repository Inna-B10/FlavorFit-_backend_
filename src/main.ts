import { ConsoleLogger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { AppModule } from './app.module'
import { isDev } from './utils/isDev.util'

async function bootstrap() {
	const logger = new ConsoleLogger()

	const app = await NestFactory.create<NestExpressApplication>(AppModule)
	//rate limiting
	if (!isDev) {
		app.use(
			'/graphql',
			rateLimit({
				windowMs: 60 * 1000,
				limit: 60, // 60 req/min per IP
				standardHeaders: true,
				legacyHeaders: false,
				message: 'Too many requests from this IP, please try again later'
			})
		)
	}

	// security headers
	if (!isDev) {
		app.use(
			helmet({
				contentSecurityPolicy: false,
				crossOriginEmbedderPolicy: false
			})
		)
	}

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
