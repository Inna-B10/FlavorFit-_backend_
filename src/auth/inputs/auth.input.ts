import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, MaxLength, MinLength } from 'class-validator'

@InputType()
export class LoginInput {
	@Field(() => String)
	@IsEmail()
	@MaxLength(100)
	email: string

	@Field(() => String)
	@MinLength(6)
	@MaxLength(64)
	password: string
}
@InputType()
export class RegisterInput {
	@Field(() => String)
	@IsEmail()
	@MaxLength(100)
	email: string

	@Field(() => String)
	@MinLength(6)
	@MaxLength(64)
	password: string

	@Field(() => String)
	@MinLength(2)
	@MaxLength(64)
	firstName: string
}
