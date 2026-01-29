import { Query, Resolver } from '@nestjs/graphql'
import { Role } from 'prisma/generated/prisma/enums'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { UserModel, UserWithProfileModel } from './models/user-profile.model'
import { UsersService } from './users.service'

@Resolver()
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	//* -------------------------------- Get User -------------------------------- */
	@Query(() => UserModel, { name: 'getUser' })
	@Auth()
	getUser(@CurrentUser('userId') userId: string) {
		return this.usersService.findUserById(userId)
	}

	//* -------------------------- User With Full Profile ------------------------- */
	@Query(() => UserWithProfileModel, { name: 'getFullProfile' })
	@Auth()
	getFullProfile(@CurrentUser('userId') userId: string) {
		return this.usersService.findFullProfile(userId)
	}

	/*test*/
	@Query(() => [UserModel], { name: 'getAllUsers' })
	@Auth(Role.ADMIN)
	async getAllUsers() {
		return this.usersService.findAllUsers()
	}
}
