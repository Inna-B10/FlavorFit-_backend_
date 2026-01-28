import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { TCurrentUser } from '../auth.interface'

type TRequestWithUser = {
	user?: TCurrentUser
}
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

// @CurrentUser() user: UserModel
// @CurrentUser('id') userId: string
