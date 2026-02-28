import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, MaxLength } from 'class-validator'
import { NormalizeEmail } from 'src/common/class-transformer/string.decorators'

@InputType()
export class RequestEmailActionsInput {
	@Field(() => String)
	@NormalizeEmail()
	@IsEmail()
	@MaxLength(100)
	email: string
}
