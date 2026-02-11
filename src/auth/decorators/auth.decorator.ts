import { applyDecorators, UseGuards } from '@nestjs/common'
import { Role } from 'prisma/generated/prisma/client'
import { GqlAdminGuard } from '../guards/admin.guard'
import { GqlAuthGuard } from '../guards/auth.guard'

export const Auth = (role: Role = Role.USER) => {
	if (role === Role.ADMIN) {
		return applyDecorators(UseGuards(GqlAuthGuard, GqlAdminGuard))
	}
	return applyDecorators(UseGuards(GqlAuthGuard))
}

// example:
// ex. Auth(_,subscription)
