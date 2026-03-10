import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { Trim } from 'src/common/class-transformer/string.decorators'

@InputType()
export class UpdateAvatarInput {
	@Field(() => String)
	@IsString()
	@Trim()
	avatarUrl: string

	@Field(() => String)
	@IsString()
	@Trim()
	avatarBlobPath: string
}
