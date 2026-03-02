import { Injectable } from '@nestjs/common'
import { rethrowPrismaKnownErrors } from 'src/common/prisma/prisma-errors'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateProductVariantInput } from '../inputs/product-variant/create-product-variants.input'
import { UpdateProductVariantInput } from '../inputs/product-variant/update-product-variants.input'

@Injectable()
export class ProductVariantsService {
	constructor(private readonly prisma: PrismaService) {}

	//* -------------------------- Variants By ProductId ------------------------- */
	async getAllProductVariantsByProductId(productId: string) {
		return await this.prisma.productVariant.findMany({ where: { productId } })
	}

	//* ------------------------------ Variant ById ------------------------------ */
	async getVariantById(productVariantId: string) {
		return await this.prisma.productVariant.findUnique({ where: { productVariantId } })
	}

	//* ------------------------------ Create Variant ------------------------------ */
	async createProductVariant(productId: string, input: CreateProductVariantInput) {
		const { label: labelVariant, ...rest } = input
		try {
			return await this.prisma.productVariant.create({
				data: {
					productId,
					label: labelVariant.toLowerCase(),
					...rest
				}
			})
		} catch (e) {
			rethrowPrismaKnownErrors(e, { notFound: { type: 'product', id: productId } })
		}
	}

	//* ------------------------------ Update Variant ------------------------------ */
	async updateProductVariant(productVariantId: string, input: UpdateProductVariantInput) {
		if (input.label) {
			input.label = input.label.toLowerCase()
		}
		try {
			return await this.prisma.productVariant.update({
				where: { productVariantId },
				data: input
			})
		} catch (e) {
			rethrowPrismaKnownErrors(e, { notFound: { type: 'productVariant', id: productVariantId } })
		}
	}

	//* ------------------------------ Delete Variant ------------------------------ */
	async deleteProductVariant(productVariantId: string) {
		try {
			return await this.prisma.productVariant.delete({ where: { productVariantId } })
		} catch (e) {
			rethrowPrismaKnownErrors(e, { notFound: { type: 'productVariant', id: productVariantId } })
		}
	}
}
