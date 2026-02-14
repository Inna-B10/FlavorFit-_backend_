import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Role } from 'prisma/generated/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'

import { FullProfileUpdateInput } from 'src/users/inputs/user-profile.input'
import { UserModel, UserWithProfileModel } from './models/user-profile.model'
import { UsersService } from './users.service'

@Resolver()
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	//* -------------------------------- User By Id -------------------------------- */
	@Query(() => UserModel, { name: 'userById' })
	@Auth()
	getUserById(@CurrentUser('userId') userId: string) {
		return this.usersService.findUserById(userId)
	}

	//* -------------------------- User With Full Profile ------------------------- */
	@Query(() => UserWithProfileModel, { name: 'fullProfile' })
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

	//* ------------------------------ Get All Users ----------------------------- */
	@Query(() => [UserModel], { name: 'allUsers' })
	@Auth(Role.ADMIN)
	async getAllUsers() {
		return this.usersService.findAllUsers()
	}

	//* ------------------------------ Delete User ------------------------------- */
	@Mutation(() => Boolean)
	@Auth(Role.ADMIN)
	async deleteUser(@Args('userId') userId: string) {
		return this.usersService.deleteUser(userId)
	}
}
