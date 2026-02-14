import { ForbiddenError } from '@nestjs/apollo'
import { Role } from 'prisma/generated/enums'

//* ------------------------- Build Where With Access ------------------------ */
export function buildWhereWithAccess<T extends Record<string, unknown>>(
	userId: string,
	userRole: Role,
	where: T
): T & { userId?: string } {
	if (userRole === Role.ADMIN) {
		return where
	}
	if (userRole === Role.USER) {
		return { ...where, userId }
	}
	throw new ForbiddenError("You don't have permission")
}
