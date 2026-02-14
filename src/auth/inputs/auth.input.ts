import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class LoginInput {
	@Field({ nullable: false })
	email: string

	@Field({ nullable: false })
	password: string
}
@InputType()
export class RegisterInput {
	@Field({ nullable: false })
	email: string

	@Field({ nullable: false })
	password: string

	@Field({ nullable: false })
	firstName: string
}
