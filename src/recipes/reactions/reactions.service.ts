import { Injectable, NotFoundException } from '@nestjs/common'
import { Role } from 'prisma/generated/client'
import { buildWhereWithAccess } from 'src/common/access/build-where-with-access.helper'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateCommentInput, UpdateCommentInput } from './inputs/comment.input'

@Injectable()
export class ReactionsService {
	constructor(private readonly prisma: PrismaService) {}

	//* ------------------------------- Toggle Like ------------------------------- */
	async toggleLike(recipeId: string, userId: string) {
		const existingLike = await this.prisma.like.findUnique({
			where: {
				recipeId_userId: {
					recipeId,
					userId
				}
			}
		})

		if (existingLike) {
			await this.prisma.like.delete({
				where: {
					likeId: existingLike.likeId
				}
			})
			return { liked: false }
		} else {
			await this.prisma.like.create({
				data: {
					user: {
						connect: { userId }
					},
					recipe: {
						connect: { recipeId }
					}
				}
			})
			return { liked: true }
		}
	}

	//* ------------------------------- Create Comment ------------------------------ */
	createComment(userId: string, input: CreateCommentInput) {
		return this.prisma.comment.create({
			data: {
				message: input.message,
				recipe: {
					connect: { recipeId: input.recipeId }
				},
				user: {
					connect: { userId }
				}
			}
		})
	}

	//* ----------------------------- Update Comment ----------------------------- */
	async updateComment(
		userId: string,
		userRole: Role,
		commentId: string,
		input: UpdateCommentInput
	) {
		const comment = await this.prisma.comment.findUnique({
			where: {
				commentId
			}
		})

		if (!comment) {
			throw new NotFoundException('Comment not found')
		}

		const where = buildWhereWithAccess(userId, userRole, { commentId })

		return this.prisma.comment.update({
			where,
			data: {
				message: input.message
			},
			include: {
				user: true
			}
		})
	}
	//* ----------------------------- Delete Comment ----------------------------- */
	async deleteComment(userId: string, userRole: Role, commentId: string) {
		const comment = await this.prisma.comment.findUnique({
			where: {
				commentId
			}
		})

		if (!comment) {
			throw new NotFoundException('Comment not found')
		}

		const where = buildWhereWithAccess(userId, userRole, { commentId })

		return this.prisma.comment.delete({
			where
		})
	}
}
