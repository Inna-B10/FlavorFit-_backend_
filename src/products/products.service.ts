import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

import { CreateProductInput } from './inputs/product/create-product.input'
import { UpdateProductInput } from './inputs/product/update-product.input'

@Injectable()
export class ProductsService {
	constructor(private readonly prisma: PrismaService) {}
	async getAllProducts() {
		return this.prisma.product.findMany({
			include: {
				purchaseOptions: true
			}
		})
	}

	async getProductById(productId: string) {
		const product = await this.prisma.product.findUnique({
			where: {
				productId
			},
			include: {
				purchaseOptions: true
			}
		})
		if (!product) {
			throw new NotFoundException('Product not found')
		}
		return product
	}

	async createProduct(input: CreateProductInput) {
		const { purchaseOptions, ...productData } = input

		return this.prisma.product.create({
			data: {
				...productData,
				purchaseOptions: {
					create: purchaseOptions.map(po => ({
						pricingAmount: po.pricingAmount,
						pricingUnit: po.pricingUnit,
						price: po.price,
						description: po.description
					}))
				}
			},
			include: {
				purchaseOptions: true
			}
		})
	}

	async updateProduct(productId: string, input: UpdateProductInput) {
		try {
			return await this.prisma.product.update({
				where: { productId },
				data: input,
				include: { purchaseOptions: true }
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
				throw new NotFoundException(`Product with ID '${productId}' not found`)
			}
			throw e
		}
	}

	async deleteProduct(productId: string) {
		try {
			return await this.prisma.product.delete({
				where: {
					productId
				},
				include: {
					purchaseOptions: true
				}
			})
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
				throw new NotFoundException(`Product with ID '${productId}' not found`)
			}
			throw e
		}
	}
}
