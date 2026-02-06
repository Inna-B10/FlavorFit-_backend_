import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { Role } from 'src/graphql/graphql.enums'
import { CreateCommentInput } from './inputs/comment.input'
import { CommentModel } from './models/comment.model'
import { ToggleLikeResponse } from './models/toggle-like.response'
import { ReactionsService } from './reactions.service'

@Resolver()
export class ReactionsResolver {
	constructor(private readonly reactionsService: ReactionsService) {}

	//* ----------------------------- Create Comment ----------------------------- */
	@Mutation(() => CommentModel)
	@Auth()
	createComment(@CurrentUser('userId') userId: string, @Args('input') input: CreateCommentInput) {
		return this.reactionsService.createComment(userId, input)
	}

	//* ------------------------------ Update Comment ----------------------------- */
	@Mutation(() => CommentModel)
	@Auth()
	updateComment(
		@CurrentUser('userId') userId: string,
		@CurrentUser('role') userRole: Role,
		@Args('commentId') commentId: string,
		@Args('input') input: CreateCommentInput
	) {
		return this.reactionsService.updateComment(userId, userRole, commentId, input)
	}

	//* ----------------------------- Delete Comment ----------------------------- */
	@Mutation(() => CommentModel)
	@Auth()
	deleteComment(
		@CurrentUser('userId') userId: string,
		@CurrentUser('role') userRole: Role,
		@Args('commentId') commentId: string
	) {
		return this.reactionsService.deleteComment(userId, userRole, commentId)
	}

	//* ------------------------------- Toggle Like ------------------------------ */
	@Mutation(() => ToggleLikeResponse)
	@Auth()
	toggleLike(@CurrentUser('userId') userId: string, @Args('recipeId') recipeId: string) {
		return this.reactionsService.toggleLike(recipeId, userId)
	}
}
