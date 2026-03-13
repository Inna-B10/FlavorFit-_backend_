import { BadRequestException, Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { UserUpdateInput } from 'prisma/generated/models'
import { rethrowPrismaKnownErrors } from 'src/common/prisma/prisma-errors'
import { PrismaService } from 'src/prisma/prisma.service'
import { FullProfileUpdateInput } from 'src/users/inputs/user-profile.input'
import { UpdateAvatarInput } from './inputs/update-avatar.input'

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	//* ------------------------------- Create User ------------------------------ */
	async createUser(email: string, password: string, firstName: string) {
		const verificationToken = randomUUID()

		const user = await this.prisma.user.create({
			data: {
				email,
				password,
				firstName,
				verificationToken
			}
		})

		if (user) {
			await this.prisma.cart.create({ data: { userId: user.userId }, select: { cartId: true } })

			await this.prisma.shoppingList.create({
				data: { userId: user.userId },
				select: { listId: true }
			})

			await this.prisma.userProfile.create({
				data: { userId: user.userId },
				select: { profileId: true }
			})

			await this.prisma.fitnessProfile.create({
				data: { userId: user.userId },
				select: { fitnessProfileId: true }
			})
		}

		return user
	}

	//* ----------------------------- Find User By Id ---------------------------- */
	async findUserById(userId: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				userId
			}
		})

		if (!user) {
			throw new BadRequestException('User not found')
		}

		return user
	}

	//* ---------------------------- Find Full Profile --------------------------- */
	async findFullProfile(userId: string) {
		return this.prisma.user.findUnique({
			where: {
				userId
			},
			include: {
				userProfile: true,
				fitnessProfile: true
			}
		})
	}

	//* ------------------------------- Update User ------------------------------ */
	async updateUser(userId: string, input: UserUpdateInput) {
		return this.prisma.user.update({
			where: {
				userId
			},
			data: {
				...input
			}
		})
	}

	//* ------------------------------ Update Avatar ------------------------------ */
	async updateAvatar(userId: string, input: UpdateAvatarInput) {
		const user = await this.prisma.user.update({
			where: {
				userId
			},
			data: {
				avatarUrl: input.avatarUrl,
				avatarBlobPath: input.avatarBlobPath
			}
		})
		return user
	}

	//* ------------------------------ Delete Avatar ------------------------------ */
	async deleteAvatar(userId: string) {
		const user = await this.prisma.user.update({
			where: {
				userId
			},
			data: {
				avatarUrl: null,
				avatarBlobPath: null
			}
		})
		if (!user) {
			throw new BadRequestException('Failed to delete avatar')
		}
		return true
	}

	//* --------------------------- Update Full Profile -------------------------- */
	async updateFullProfile(userId: string, input: FullProfileUpdateInput) {
		const { userProfile, fitnessProfile } = input

		const updateUserProfile = userProfile
			? {
					userProfile: {
						upsert: {
							create: userProfile,
							update: userProfile
						}
					}
				}
			: {}

		const updateFitnessProfile = fitnessProfile
			? {
					fitnessProfile: {
						upsert: {
							create: fitnessProfile,
							update: fitnessProfile
						}
					}
				}
			: {}

		return this.prisma.user.update({
			where: {
				userId
			},
			data: {
				...updateUserProfile,
				...updateFitnessProfile
			},
			include: {
				userProfile: true,
				fitnessProfile: true
			}
		})
	}

	/* ========================================================================== */
	/*                                    ADMIN                                   */
	/* ========================================================================== */

	//* ----------------------------- Find All Users ----------------------------- */
	async findAllUsers() {
		return this.prisma.user.findMany()
	}

	//* --------------------------- Find User By Email --------------------------- */
	async findUserByEmail(email: string) {
		return this.prisma.user.findFirst({
			where: {
				email: {
					equals: email,
					mode: 'insensitive'
				}
			}
		})
	}

	//* ------------------------------ Delete User ------------------------------- */
	async deleteUser(userId: string) {
		try {
			await this.prisma.user.delete({
				where: {
					userId
				}
			})
			return true
		} catch (e) {
			rethrowPrismaKnownErrors(e, { notFound: { type: 'user', id: userId } })
		}
	}
}
