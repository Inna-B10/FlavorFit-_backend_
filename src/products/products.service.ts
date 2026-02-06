import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { rethrowPrismaKnownErrors } from 'src/utils/prisma-errors'
import { CreateProductInput } from './inputs/product/create-product.input'
import { UpdateProductInput } from './inputs/product/update-product.input'

@Injectable()
export class ProductsService {
	constructor(private readonly prisma: PrismaService) {}
	async getAllProducts() {
		return this.prisma.product.findMany({
			include: {
				productVariants: true
			}
		})
	}

	async getProductById(productId: string) {
		const product = await this.prisma.product.findUnique({
			where: {
				productId
			},
			include: {
				productVariants: true
			}
		})
		if (!product) {
			throw new NotFoundException(`Product with ID ${productId} not found`)
		}
		return product
	}

	async createProduct(input: CreateProductInput) {
		const { productVariants, ...productData } = input

		return this.prisma.product.create({
			data: {
				...productData,
				...(!!productVariants?.length && {
					productVariants: {
						create: productVariants.map(po => ({
							pricingAmount: po.pricingAmount,
							pricingUnit: po.pricingUnit,
							price: po.price,
							label: po.label,
							note: po.note
						}))
					}
				})
			},
			include: {
				productVariants: true
			}
		})
	}

	async updateProduct(productId: string, input: UpdateProductInput) {
		try {
			return await this.prisma.product.update({
				where: { productId },
				data: input,
				include: { productVariants: true }
			})
		} catch (e) {
			rethrowPrismaKnownErrors(e, { notFound: { type: 'product', id: productId } })
		}
	}

	async deleteProduct(productId: string) {
		try {
			return await this.prisma.product.delete({
				where: {
					productId
				},
				include: {
					productVariants: true
				}
			})
		} catch (e) {
			rethrowPrismaKnownErrors(e, { notFound: { type: 'product', id: productId } })
		}
	}
}
