import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	//* ----------------------------- Find All Users ----------------------------- */
	async findAllUsers() {
		return this.prisma.user.findMany()
	}

	//* --------------------------- Find User By Email --------------------------- */
	async findByEmail(email: string) {
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
