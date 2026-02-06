import { ForbiddenError } from '@nestjs/apollo'
import { CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Role } from 'src/graphql/graphql.enums'
import type { TRequestWithUser } from '../auth.interface'

export class GqlAdminGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}
	canActivate(context: ExecutionContext): boolean {
		const ctx = GqlExecutionContext.create(context)
		const user = ctx.getContext<{ req: TRequestWithUser }>().req.user

		if (user?.role !== Role.ADMIN) {
			throw new ForbiddenError("You don't have permission to access this resource")
		}

		return true
	}
}
