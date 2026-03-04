import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'
import { MediaUploadController } from './media-upload.controller'
import { MediaUploadService } from './media-upload.service'

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads'
		})
	],
	providers: [MediaUploadService],
	controllers: [MediaUploadController]
})
export class MediaUploadModule {}
