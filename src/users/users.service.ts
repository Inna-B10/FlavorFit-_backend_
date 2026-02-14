import { BadRequestException, Injectable } from '@nestjs/common'
import { UserUpdateInput } from 'prisma/generated/models'
import { PrismaService } from 'src/prisma/prisma.service'
import { FullProfileUpdateInput } from 'src/users/inputs/user-profile.input'
import { rethrowPrismaKnownErrors } from 'src/utils/prisma-errors'

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	//* ------------------------------- Create User ------------------------------ */
	async createUser(email: string, password: string, firstName: string) {
		const user = await this.prisma.user.create({
			data: {
				email,
				password,
				firstName
			}
		})

		if (user) {
			await this.prisma.cart.create({ data: { userId: user.userId }, select: { cartId: true } })

			await this.prisma.shoppingList.create({
				data: { userId: user.userId },
				select: { listId: true }
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
	//* --------------------------- Update Full Profile -------------------------- */
	async updateFullProfile(userId: string, input: FullProfileUpdateInput) {
		const { profile, fitnessProfile } = input

		const updateUserProfile = profile
			? {
					userProfile: {
						upsert: {
							create: profile,
							update: profile
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

	//* ----------------------------- Find All Users ----------------------------- */
	async findAllUsers() {
		return this.prisma.user.findMany()
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
