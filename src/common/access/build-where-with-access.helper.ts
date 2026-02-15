import { ForbiddenError } from '@nestjs/apollo'
import { Role } from 'prisma/generated/enums'

//* ------------------------- Build Where With Access ------------------------ */
export function buildWhereWithAccess<T extends Record<string, unknown>>(
	userId: string,
	userRole: Role,
	where: T
): T & { userId?: string } {
	switch (userRole) {
		case Role.ADMIN:
			return where
		case Role.USER:
			return { ...where, userId }
		default:
			throw new ForbiddenError("You don't have permission")
	}
}
