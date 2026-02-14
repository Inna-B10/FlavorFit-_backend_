import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Role } from 'prisma/generated/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { FullProfileUpdateInput, UserUpdateInput } from 'src/users/inputs/user-profile.input'
import { UserModel, UserWithProfileModel } from './models/user-profile.model'
import { UsersService } from './users.service'

@Resolver()
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	//* -------------------------------- User By Id -------------------------------- */
	@Query(() => UserModel, { name: 'userById' })
	@Auth()
	getUserById(
		@CurrentUser('userId') currentUserId: string,
		@CurrentUser('role') role: Role,
		@Args('userId', { nullable: true }) userId?: string
	) {
		const targetUserId = role === Role.ADMIN && userId ? userId : currentUserId
		return this.usersService.findUserById(targetUserId)
	}

	//* -------------------------- Get Full Profile ------------------------- */
	@Query(() => UserWithProfileModel, { name: 'fullProfile' })
	@Auth()
	getFullProfile(@CurrentUser('userId') userId: string) {
		return this.usersService.findFullProfile(userId)
	}

	//* ------------------------------- Update User ------------------------------ */
	@Mutation(() => UserModel)
	@Auth()
	updateUser(@CurrentUser('userId') userId: string, @Args('input') input: UserUpdateInput) {
		return this.usersService.updateUser(userId, input)
	}

	//* ----------------------------- Update Full Profile ----------------------------- */
	@Mutation(() => UserWithProfileModel)
	@Auth()
	updateFullProfile(
		@CurrentUser('userId') userId: string,
		@Args('input') input: FullProfileUpdateInput
	) {
		return this.usersService.updateFullProfile(userId, input)
	}

	/* ========================================================================== */
	/*                                    ADMIN                                   */
	/* ========================================================================== */

	//* ------------------------------ Get All Users ----------------------------- */
	@Query(() => [UserModel], { name: 'allUsers' })
	@Auth(Role.ADMIN)
	async getAllUsers() {
		return this.usersService.findAllUsers()
	}

	//* -------------------------------- User By Email -------------------------------- */
	@Query(() => UserModel, { name: 'userByEmail' })
	@Auth(Role.ADMIN)
	getUserByEmail(@Args('email') email: string) {
		return this.usersService.findUserByEmail(email)
	}

	//* ------------------------------ Delete User ------------------------------- */
	@Mutation(() => Boolean)
	@Auth(Role.ADMIN)
	async deleteUser(@Args('userId') userId: string) {
		return this.usersService.deleteUser(userId)
	}
}
