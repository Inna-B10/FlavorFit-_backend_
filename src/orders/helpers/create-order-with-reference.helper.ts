import { Prisma } from 'prisma/generated/prisma/client'

//* ------------------- Create Order With Unique Reference ------------------- */
export async function createOrderWithUniqueReference(
	tx: Prisma.TransactionClient,
	data: Omit<Prisma.OrderCreateInput, 'orderReference'>
): Promise<{ orderId: string }> {
	for (let i = 0; i < 5; i++) {
		const orderReference = generateOrderReference()
		try {
			return await tx.order.create({
				data: { ...data, orderReference },
				select: { orderId: true }
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
				continue // collision, retry
			}
			throw e
		}
	}
	throw new Error('Could not generate unique order reference')
}

//* ------------------------ Generate Order Reference ------------------------ */
export function generateOrderReference(): string {
	// example: ORD-20260210-482917
	const date = new Date()
	const y = date.getFullYear().toString()
	const m = String(date.getMonth() + 1).padStart(2, '0')
	const d = String(date.getDate()).padStart(2, '0')
	const rnd = Math.floor(100000 + Math.random() * 900000) // 6 digits
	return `ORD-${y}${m}${d}-${rnd}`
}
