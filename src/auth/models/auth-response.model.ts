import { Field, ObjectType } from '@nestjs/graphql'
import { UserModel } from 'src/users/models/user-profile.model'

@ObjectType()
export class AuthResponse {
	@Field(() => UserModel)
	user: UserModel
}
