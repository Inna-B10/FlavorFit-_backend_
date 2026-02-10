import { BadRequestException } from '@nestjs/common'
import Decimal from 'decimal.js'
import { Prisma } from 'prisma/generated/prisma/client'

export async function validateCartItem(
	tx: Prisma.TransactionClient,
	productId: string,
	productVariantId?: string | null,
	goodsCount?: Decimal | null
) {
	const variantProvided = productVariantId !== undefined
	const countProvided = goodsCount !== undefined

	//2. enforce "together" rule BEFORE writes
	if (variantProvided !== countProvided)
		throw new BadRequestException('productVariantId and goodsCount must be provided together')

	//3. if nothing provided - just "no-op validation"
	if (!variantProvided && !countProvided) return

	//4. validate productVariant if provided & not null
	if (productVariantId !== null) {
		const variant = await tx.productVariant.findUnique({
			where: { productVariantId: productVariantId },
			select: { productId: true }
		})

		if (!variant || variant.productId !== productId)
			throw new BadRequestException('Product variant does not belong to this product')
	}

	//5. validate goodsCount if provided & not null
	if (goodsCount !== null && goodsCount!.lt(0))
		throw new BadRequestException('goodsCount must be greater or equal to 0')
}
