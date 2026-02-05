import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateProductVariantInput } from '../inputs/product-variant/create-product-variants.input'
import { UpdateProductVariantInput } from '../inputs/product-variant/update-product-variants.input'

@Injectable()
export class ProductVariantsService {
	constructor(private readonly prisma: PrismaService) {}

	async getAllProductVariantsByProductId(productId: string) {
		return await this.prisma.productVariants.findMany({ where: { productId } })
	}

	async createProductVariant(productId: string, input: CreateProductVariantInput) {
		try {
			return await this.prisma.productVariants.create({ data: { productId, ...input } })
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2003') {
				throw new BadRequestException(`Product with ID '${productId}' not found`)
			}
			throw e
		}
	}

	async updateProductVariant(productVariantId: string, input: UpdateProductVariantInput) {
		// for not to save undefined
		const data = Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined))

		try {
			return await this.prisma.productVariant.update({
				where: { productVariantId },
				data
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
				throw new NotFoundException(`ProductVariant with ID '${productVariantId}' not found`)
			}
			throw e
		}
	}

	async deleteProductVariant(productVariantId: string) {
		try {
			return await this.prisma.productVariant.delete({ where: { productVariantId } })
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
				throw new NotFoundException(`ProductVariant with ID '${productVariantId}' not found`)
			}
			throw e
		}
	}
}
