import { Controller, HttpCode, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { MediaUploadService } from './media-upload.service'

@Controller('media-upload')
export class MediaUploadController {
	constructor(private readonly mediaService: MediaUploadService) {}

	@HttpCode(200)
	@Post('avatar')
	@Auth()
	@UseInterceptors(
		FileInterceptor('file', {
			limits: {
				fileSize: 1024 * 1024 * 5 // 5MB
			}
		})
	)
	async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
		const uploaded = await this.mediaService.saveAvatar(file)
		return uploaded
	}
}
