import { Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { UserModel } from './models/user-profile.model'
import { UsersService } from './users.service'

@Resolver()
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	@Query(() => UserModel, { name: 'profile' })
	getProfile(@CurrentUser('userId') userId: string) {
		return this.usersService.findUserById(userId)
	}
}
