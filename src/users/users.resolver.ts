import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Role } from 'prisma/generated/prisma/enums'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'

import { FullProfileUpdateInput } from 'src/graphql/user/user.input'
import { UserModel, UserWithProfileModel } from './models/user-profile.model'
import { UsersService } from './users.service'

@Resolver()
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	//* -------------------------------- Get User -------------------------------- */
	@Query(() => UserModel, { name: 'User' })
	@Auth()
	getUser(@CurrentUser('userId') userId: string) {
		return this.usersService.findUserById(userId)
	}

	//* -------------------------- User With Full Profile ------------------------- */
	@Query(() => UserWithProfileModel, { name: 'FullProfile' })
	@Auth()
	getFullProfile(@CurrentUser('userId') userId: string) {
		return this.usersService.findFullProfile(userId)
	}

	//* ----------------------------- Update Profile ----------------------------- */
	@Mutation(() => UserWithProfileModel)
	@Auth()
	updateFullProfile(
		@CurrentUser('userId') userId: string,
		@Args('input') input: FullProfileUpdateInput
	) {
		return this.usersService.updateFullProfile(userId, input)
	}

	//*test*/
	@Query(() => [UserModel], { name: 'AllUsers' })
	@Auth(Role.ADMIN)
	async getAllUsers() {
		return this.usersService.findAllUsers()
	}
}
