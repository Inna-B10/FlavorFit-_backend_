import { UserModel } from 'src/users/models/user-profile.model'

export type IAuthTokenData = Pick<UserModel, 'userId' | 'role'>

//current user at the time of authorization
export type TCurrentUser = Omit<UserModel, 'password'>

export type TRequestWithUser = {
	user?: TCurrentUser
}
