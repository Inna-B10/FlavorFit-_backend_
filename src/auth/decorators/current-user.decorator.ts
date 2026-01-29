import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import type { TCurrentUser, TRequestWithUser } from '../auth.interface'

export const CurrentUser = createParamDecorator(
	(data: keyof TCurrentUser | undefined, ctx: ExecutionContext) => {
		let user: TCurrentUser | null | undefined = null

		if (ctx.getType() === 'http') {
			user = ctx.switchToHttp().getRequest<TRequestWithUser>().user
		} else {
			const context = GqlExecutionContext.create(ctx)
			user = context.getContext<{ req: TRequestWithUser }>().req.user
		}

		if (!user) {
			return null
		}
		return data ? user[data] : user
	}
)

// examples:
// @CurrentUser() user: UserModel
// @CurrentUser('id') userId: string
