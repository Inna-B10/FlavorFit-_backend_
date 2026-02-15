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
	@MinLength(6)
	@MaxLength(64)
	// @MinLength(8)
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
	@MinLength(6)
	@MaxLength(64)
	// @MinLength(8)
	// @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
	// 	message: 'Password must contain uppercase, lowercase and number'
	// })
	password: string

	@Field(() => String)
	@IsString()
	@Trim()
	@MinLength(2)
	@MaxLength(64)
	// @Matches(/^[A-Za-zÀ-ÿ\s-]+$/, {
	// 	message: 'First name contains invalid characters'
	// })
	firstName: string
}
