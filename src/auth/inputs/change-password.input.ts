import { Field, InputType } from '@nestjs/graphql'
import { IsString, MaxLength, MinLength } from 'class-validator'
import { Trim } from 'src/common/class-transformer/string.decorators'

@InputType()
export class ChangePasswordInput {
	@Field(() => String)
	@IsString()
	@Trim()
	@MinLength(6, { message: 'Password is too short' })
	@MaxLength(64, { message: 'Password is too long' })
	// @MinLength(8, { message: 'Password is too short' })
	// @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
	// 	message: 'Password must contain uppercase, lowercase and number'
	// })
	currentPassword: string

	@Field(() => String)
	@IsString()
	@Trim()
	@MinLength(6, { message: 'Password is too short' })
	@MaxLength(64, { message: 'Password is too long' })
	// @MinLength(8, { message: 'Password is too short' })
	// @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
	// 	message: 'Password must contain uppercase, lowercase and number'
	// })
	newPassword: string
}
