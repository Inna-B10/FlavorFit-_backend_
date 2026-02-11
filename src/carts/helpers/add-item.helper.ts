import { Prisma } from 'prisma/generated/client'
import { rethrowPrismaKnownErrors } from 'src/utils/prisma-errors'

//* -------------------------- Add One Item To Cart -------------------------- */
export async function addOneItemToCartHelper(
	tx: Prisma.TransactionClient,
	cartId: string,
	productId: string
) {
	return await tx.cartItem.upsert({
		where: {
			cartId_productId: {
				cartId,
				productId
			}
		},
		create: {
			cartId,
			productId,
			productVariantId: null
		},
		update: {},
		select: { cartItemId: true }
	})
}

//* ---------------------------- Link Requirement ---------------------------- */
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
