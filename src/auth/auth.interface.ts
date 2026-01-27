import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Role } from 'prisma/generated/prisma/enums'

export interface IAuthTokenData {
	userId: string
	role: Role
}

registerEnumType(Role, { name: 'Role' })

// [TODO] generate Models from Prisma to graphql

@ObjectType()
export class UserModel {
	@Field()
	userId: string
	@Field()
	email: string
	@Field()
	role: Role
}

@ObjectType()
export class AuthResponse {
	@Field(() => UserModel)
	user: UserModel

	@Field()
	accessToken: string
}
