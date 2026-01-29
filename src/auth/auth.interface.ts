import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Role } from 'prisma/generated/prisma/enums'
import { UserModel } from 'src/users/models/user-profile.model'

registerEnumType(Role, { name: 'Role' })

export interface IAuthTokenData {
	userId: string
	role: Role
}

//current user at the time of authorization
export type TCurrentUser = Omit<UserModel, 'password'>

export type TRequestWithUser = {
	user?: TCurrentUser
}

// [TODO] generate Models from Prisma to graphql

@ObjectType()
export class AuthResponse {
	@Field(() => UserModel)
	user: UserModel

	@Field()
	accessToken: string
}
