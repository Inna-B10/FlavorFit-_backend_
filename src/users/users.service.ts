import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	//* ----------------------------- Find User By Id ---------------------------- */
	async findUserById(userId: string) {
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
}
