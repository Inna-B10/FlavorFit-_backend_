import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreatePurchaseOptionInput } from '../inputs/purchase-options/create-purchase-options.input'
import { UpdatePurchaseOptionInput } from '../inputs/purchase-options/update-purchase-options.input'

@Injectable()
export class PurchaseOptionsService {
	constructor(private readonly prisma: PrismaService) {}

	async getAllPurchaseOptionsByProductId(productId: string) {
		return this.prisma.purchaseOption.findMany({ where: { productId } })
	}

	async createPurchaseOption(productId: string, input: CreatePurchaseOptionInput) {
		try {
			return await this.prisma.purchaseOption.create({ data: { productId, ...input } })
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2003') {
				throw new BadRequestException(`Product with ID '${productId}' not found`)
			}
			throw e
		}
	}

	async updatePurchaseOption(purchaseOptionId: string, input: UpdatePurchaseOptionInput) {
		// for not to save undefined
		const data = Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined))

		try {
			return await this.prisma.purchaseOption.update({
				where: { purchaseOptionId },
				data
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
				throw new NotFoundException(`PurchaseOption with ID '${purchaseOptionId}' not found`)
			}
			throw e
		}
	}

	async deletePurchaseOption(purchaseOptionId: string) {
		try {
			return await this.prisma.purchaseOption.delete({ where: { purchaseOptionId } })
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
				throw new NotFoundException(`PurchaseOption with ID '${purchaseOptionId}' not found`)
			}
			throw e
		}
	}
}
