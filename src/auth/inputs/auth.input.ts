import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'
import { NormalizeEmail, Trim } from 'src/common/class-transformer/string.decorators'

@InputType()
export class LoginInput {
	@Field(() => String)
	@NormalizeEmail()
	@IsEmail()
	@MaxLength(100)
	email: string

	@Field(() => String)
	@Trim()
	@MinLength(6, { message: 'Password is too short' })
	@MaxLength(64, { message: 'Password is too long' })
	// @MinLength(8, { message: 'Password is too short' })
	// @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
	// 	message: 'Password must contain uppercase, lowercase and number'
	// })
	password: string
}
@InputType()
export class RegisterInput {
	@Field(() => String)
	@NormalizeEmail()
	@IsEmail()
	@MaxLength(100)
	email: string

	@Field(() => String)
	@Trim()
	@MinLength(6, { message: 'Password is too short' })
	@MaxLength(64, { message: 'Password is too long' })
	// @MinLength(8, { message: 'Password is too short' })
	// @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
	// 	message: 'Password must contain uppercase, lowercase and number'
	// })
	password: string

	@Field(() => String)
	@IsString()
	@Trim()
	@MinLength(2, { message: 'First name is too short' })
	@MaxLength(64, { message: 'First name is too long' })
	// @Matches(/^[A-Za-zÀ-ÿ\s-]+$/, {
	// 	message: 'First name contains invalid characters'
	// })
	firstName: string
}
