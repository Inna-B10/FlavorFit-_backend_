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

	const allowedOrigins = [
		'http://localhost:3000',
		'http://localhost:3001',
		'https://flavor-fit-alekinna.vercel.app'
	]

	app.enableCors({
		origin: (origin, callback) => {
			// Allow requests with no origin (like Postman) and allow listed origins
			if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
			return callback(new Error(`CORS blocked for origin: ${origin}`), false)
		},
		credentials: true,
		methods: ['GET', 'POST', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'Apollo-Require-Preflight']
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
