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

// [TODO] generate Models from Prisma to graphql

// @ObjectType()
// export class UserModel {
// 	@Field()
// 	userId: string
// 	@Field()
// 	email: string
// 	@Field()
// 	role: Role
// }

@ObjectType()
export class AuthResponse {
	@Field(() => UserModel)
	user: UserModel

	@Field()
	accessToken: string
}
