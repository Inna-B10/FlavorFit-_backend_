import { Injectable } from '@nestjs/common'
import path from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'

import * as iconv from 'iconv-lite'
import { v4 as uuidv4 } from 'uuid'
import { IUploadResponse } from './upload-response.types'

@Injectable()
export class MediaUploadService {
	constructor() {}

	async saveAvatar(file: Express.Multer.File): Promise<IUploadResponse> {
		const folder = 'avatars'
		const uploadFolder = `${path}/uploads/${folder}`
		//eslint-disable-next-line @typescript-eslint/no-unsafe-call
		await ensureDir(uploadFolder)

		//eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
		const original = iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf-8')
		const safeName = original.replace(/[^\w.-]+/g, '-').toLowerCase()
		const name = `${uuidv4().slice(0, 8)}-${safeName}`

		//eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		await writeFile(`${uploadFolder}/${name}`, file.buffer)

		const url = `/uploads/${folder}/${name}`

		return { url, name }
	}
}
