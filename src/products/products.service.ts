import { Injectable, NotFoundException } from '@nestjs/common'
import type { PrismaService } from 'src/prisma/prisma.service'
import { ProductCreateInput } from './inputs/product-create.input'
import type { ProductUpdateInput } from './inputs/product-update.input'

@Injectable()
export class ProductsService {
	constructor(private readonly prisma: PrismaService) {}
	async getAllProducts() {
		return this.prisma.product.findMany()
	}

	async getProductById(productId: string) {
		const product = await this.prisma.product.findUnique({
			where: {
				productId
			}
		})
		if (!product) {
			throw new NotFoundException('Product not found')
		}
		return product
	}

	async createProduct(input: ProductCreateInput) {
		const { purchaseOptions, ...productData } = input

		return this.prisma.product.create({
			data: {
				...productData,
				purchaseOptions: {
					create: purchaseOptions.map(po => ({
						amount: po.amount,
						saleUnit: po.saleUnit,
						price: po.price,
						description: po.description
					}))
				}
			}
		})
	}

	async updateProduct(productId: string, input: ProductUpdateInput) {
		const { purchaseOptions, ...productData } = input

		return this.prisma.product.update({
			where: { productId },
			data: {
				...productData,

				purchaseOptions: {
					// remove all connections that are not in the new list
					set: purchaseOptions
						.filter(po => po.purchaseOptionId)
						.map(po => ({ purchaseOptionId: po.purchaseOptionId! })),

					// update existing and create new ones
					upsert: purchaseOptions.map(po => ({
						where: { purchaseOptionId: po.purchaseOptionId ?? '' }, // Prisma requires where
						update: {
							amount: po.amount,
							saleUnit: po.saleUnit,
							price: po.price,
							description: po.description
						},
						create: {
							amount: po.amount,
							saleUnit: po.saleUnit,
							price: po.price,
							description: po.description
						}
					}))
				}
			}
		})
	}

	async deleteProductById(productId: string) {
		return this.prisma.product.delete({
			where: {
				productId
			}
		})
	}
}
