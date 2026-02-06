import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { rethrowPrismaKnownErrors } from 'src/utils/prisma-errors'
import { CreateProductInput } from './inputs/product/create-product.input'
import { UpdateProductInput } from './inputs/product/update-product.input'

@Injectable()
export class ProductsService {
	constructor(private readonly prisma: PrismaService) {}

	// * ------------------------------- All Products ------------------------------ */
	async getAllProducts() {
		return this.prisma.product.findMany({
			include: {
				productVariants: true
			}
		})
	}

	//* ------------------------------ Product ById ------------------------------ */
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

	//* ------------------------------ Create Product ------------------------------ */
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

	//* ------------------------------ Update Product ------------------------------ */
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

	//* ------------------------------ Delete Product ------------------------------ */
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
