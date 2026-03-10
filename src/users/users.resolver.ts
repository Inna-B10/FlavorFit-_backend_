import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Role } from 'prisma/generated/client'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { FullProfileUpdateInput, UserUpdateInput } from 'src/users/inputs/user-profile.input'
import { UpdateAvatarInput } from './inputs/update-avatar.input'
import { FullProfileModel, UserModel } from './models/user-profile.model'
import { UsersService } from './users.service'

@Resolver()
export class UsersResolver {
	constructor(private readonly usersService: UsersService) {}

	//* --------------------------------- Get Me --------------------------------- */
	@Query(() => UserModel, { name: 'me' })
	@Auth()
	getMe(@CurrentUser('userId') userId: string) {
		return this.usersService.findUserById(userId)
	}

	//* -------------------------- Get Full Profile ------------------------- */
	@Query(() => FullProfileModel, { name: 'fullProfile' })
	@Auth()
	getFullProfile(@CurrentUser('userId') userId: string) {
		return this.usersService.findFullProfile(userId)
	}

	//* ------------------------------- Update User ------------------------------ */
	@Mutation(() => UserModel)
	@Auth()
	updateUser(@CurrentUser('userId') userId: string, @Args('data') input: UserUpdateInput) {
		return this.usersService.updateUser(userId, input)
	}

	//* ------------------------------ Update Avatar ------------------------------ */
	@Mutation(() => UserModel)
	@Auth()
	updateAvatar(@CurrentUser('userId') userId: string, @Args('data') input: UpdateAvatarInput) {
		return this.usersService.updateAvatar(userId, input)
	}

	//* ------------------------------ Delete Avatar ------------------------------ */
	@Mutation(() => Boolean)
	@Auth()
	deleteAvatar(@CurrentUser('userId') userId: string) {
		return this.usersService.deleteAvatar(userId)
	}

	//* ----------------------------- Update Full Profile ----------------------------- */
	@Mutation(() => FullProfileModel)
	@Auth()
	updateFullProfile(
		@CurrentUser('userId') userId: string,
		@Args('data') input: FullProfileUpdateInput
	) {
		return this.usersService.updateFullProfile(userId, input)
	}

	/* ========================================================================== */
	/*                                    ADMIN                                   */
	/* ========================================================================== */
	//* -------------------------------- User By Id -------------------------------- */
	@Query(() => UserModel, { name: 'userById' })
	@Auth(Role.ADMIN)
	getUserById(@Args('userId', { type: () => String }) userId: string) {
		return this.usersService.findUserById(userId)
	}

	//* ------------------------------ Get All Users ----------------------------- */
	@Query(() => [UserModel], { name: 'allUsers' })
	@Auth(Role.ADMIN)
	async getAllUsers() {
		return this.usersService.findAllUsers()
	}

	//* -------------------------------- User By Email -------------------------------- */
	@Query(() => UserModel, { name: 'userByEmail' })
	@Auth(Role.ADMIN)
	getUserByEmail(@Args('email', { type: () => String }) email: string) {
		return this.usersService.findUserByEmail(email)
	}

	//* ------------------------------ Delete User ------------------------------- */
	@Mutation(() => Boolean)
	@Auth(Role.ADMIN)
	async deleteUser(@Args('userId', { type: () => String }) userId: string) {
		return this.usersService.deleteUser(userId)
	}
}
