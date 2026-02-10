import { BadRequestException } from '@nestjs/common'
import { Prisma, SaleUnit } from 'prisma/generated/prisma/client'

type ReadyCartItem = {
	cartItemId: string
	goodsCount: Prisma.Decimal
	productId: string
	product: {
		name: string
	}
	productVariantId: string
	productVariant: {
		productVariantId: string
		label: string
		price: Prisma.Decimal
		pricingAmount: Prisma.Decimal
		pricingUnit: SaleUnit
		productId: string
	} | null
}

export function buildOrderItemsSnapshot(readyItems: ReadyCartItem[]) {
	const orderItemsData: Prisma.OrderItemCreateManyOrderInput[] = []
	let totalPrice = new Prisma.Decimal(0)

	for (const ci of readyItems) {
		// Safety check (cart consistency)
		if (!ci.productVariant || ci.productVariant.productId !== ci.productId) {
			throw new BadRequestException('Invalid product variant for cart item')
		}

		const v = ci.productVariant

		const goodsCount = new Prisma.Decimal(ci.goodsCount.toString())
		const price = new Prisma.Decimal(v.price.toString())
		const pricingAmount = new Prisma.Decimal(v.pricingAmount.toString())

		// lineTotal = price * (goodsCount / pricingAmount)
		const lineTotal = price.mul(goodsCount).div(pricingAmount)

		totalPrice = totalPrice.add(lineTotal)

		orderItemsData.push({
			goodsCount: new Prisma.Decimal(goodsCount.toString()),
			productNameAtPurchase: ci.product.name,
			productVariantLabelAtPurchase: v.label,
			priceAtPurchase: new Prisma.Decimal(price.toString()),
			pricingAmountAtPurchase: new Prisma.Decimal(pricingAmount.toString()),
			pricingUnitAtPurchase: v.pricingUnit, // SaleUnit
			lineTotalAtPurchase: new Prisma.Decimal(lineTotal.toFixed(2)),
			productId: ci.productId
		})
	}

	return { orderItemsData, totalPrice }
}
