import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { FullProfileUpdateInput } from 'src/users/inputs/user-profile.input'

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	//* ----------------------------- Find All Users ----------------------------- */
	async findAllUsers() {
		return this.prisma.user.findMany()
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

	//* ------------------------------- Create User ------------------------------ */
	async createUser(email: string, password: string) {
		return this.prisma.user.create({
			data: {
				email,
				password
			}
		})
	}
	//* --------------------------- Update Full Profile -------------------------- */
	async updateFullProfile(userId: string, input: FullProfileUpdateInput) {
		const { user, profile, fitnessProfile } = input

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
				...user,
				...updateUserProfile,
				...updateFitnessProfile
			},
			include: {
				userProfile: true,
				fitnessProfile: true
			}
		})
	}
}
