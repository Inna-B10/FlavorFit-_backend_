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

	// If behind Cloudflare/Vercel proxy (recommended for correct IP / cookies / rate-limit)
	app.set('trust proxy', 1)

	const allowedOrigins = [
		'https://flavor-fit-alekinna.vercel.app',
		'http://localhost:3000',
		'http://localhost:3001'
	]

	// CORS as early as possible
	app.enableCors({
		origin: (origin, callback) => {
			// Allow no-origin (Postman, server-to-server) and allow listed origins
			if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
			return callback(new Error(`CORS blocked for origin: ${origin}`), false)
		},
		credentials: true,
		methods: ['GET', 'POST', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'Apollo-Require-Preflight'],

		// (optional) makes preflight return 204 quickly
		optionsSuccessStatus: 204
	})

	app.use(cookieParser())

	//rate limiting AFTER CORS, and skip OPTIONS preflight
	if (!isDev) {
		app.use(
			'/graphql',
			rateLimit({
				windowMs: 60 * 1000,
				limit: 60, // 60 req/min per IP
				standardHeaders: true,
				legacyHeaders: false,
				message: 'Too many requests from this IP, please try again later',
				skip: req => req.method === 'OPTIONS'
			})
		)
	}

	// security headers (helmet after CORS is fine)
	if (!isDev) {
		app.use(
			helmet({
				contentSecurityPolicy: false,
				crossOriginEmbedderPolicy: false
			})
		)
	}

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: false
			}
		})
	)

	app.disable('x-powered-by')

	const port = process.env.PORT ?? 4200
	await app.listen(port)
	logger.log(`Server running on port ${port}`)
}
bootstrap()
