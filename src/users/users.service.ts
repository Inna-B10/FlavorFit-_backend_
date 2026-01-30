import { BadRequestException, Injectable } from '@nestjs/common'
import type { ProfileUpdateInput } from 'src/graphql/user/user.input'
import { PrismaService } from 'src/prisma/prisma.service'

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

	//* ----------------------------- Find User's Full Profile ---------------------------- */
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

	//* ----------------------------- Update Profile ----------------------------- */
	async updateProfile(userId: string, data: ProfileUpdateInput) {
		await this.findUserById(userId) // check if user exists

		const {
			firstName,
			avatarUrl,

			fullName,
			gender,
			birthYear,
			bio,

			heightCm,
			currentWeight,
			targetWeight,
			chestCm,
			waistCm,
			thighCm,
			armCm,
			activityLevel,
			nutritionGoal
		} = data

		await this.prisma.user.update({
			where: { userId },
			data: {
				...(firstName !== undefined && { firstName }),
				...(avatarUrl !== undefined && { avatarUrl })
			}
		})

		await this.prisma.userProfile.upsert({
			where: { userId },
			create: {
				userId,
				fullName,
				gender,
				birthYear,
				bio
			},
			update: {
				...(fullName !== undefined && { fullName }),
				...(gender !== undefined && { gender }),
				...(birthYear !== undefined && { birthYear }),
				...(bio !== undefined && { bio })
			}
		})

		await this.prisma.fitnessProfile.upsert({
			where: { userId },
			create: {
				userId,
				heightCm,
				currentWeight,
				targetWeight,
				chestCm,
				waistCm,
				thighCm,
				armCm,
				activityLevel,
				nutritionGoal
			},
			update: {
				...(heightCm !== undefined && { heightCm }),
				...(currentWeight !== undefined && { currentWeight }),
				...(targetWeight !== undefined && { targetWeight }),
				...(chestCm !== undefined && { chestCm }),
				...(waistCm !== undefined && { waistCm }),
				...(thighCm !== undefined && { thighCm }),
				...(armCm !== undefined && { armCm }),
				...(activityLevel !== undefined && { activityLevel }),
				...(nutritionGoal !== undefined && { nutritionGoal })
			}
		})

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
}
