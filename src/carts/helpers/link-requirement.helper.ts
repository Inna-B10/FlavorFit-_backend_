import { Prisma } from 'prisma/generated/prisma/client'
import { rethrowPrismaKnownErrors } from 'src/utils/prisma-errors'

export async function linkRequirement(
	tx: Prisma.TransactionClient,
	cartItemId: string,
	listItemId: string
) {
	try {
		await tx.cartItemRequirement.create({
			data: {
				cartItemId: cartItemId,
				listItemId: listItemId
			}
		})
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
			return
		}
		rethrowPrismaKnownErrors(e)
	}
}
