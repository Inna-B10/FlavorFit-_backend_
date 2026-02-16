import { Injectable, NotFoundException } from '@nestjs/common'
import { Role } from 'prisma/generated/enums'
import { rethrowPrismaKnownErrors } from 'src/common/prisma/prisma-errors'
import { PrismaService } from 'src/prisma/prisma.service'
import { checkUniqueProduct } from './helpers/check-unique-product.helper'
import { CreateProductInput } from './inputs/product/create-product.input'
import { UpdateProductInput } from './inputs/product/update-product.input'

@Injectable()
export class ProductsService {
	constructor(private readonly prisma: PrismaService) {}

	//* ------------------------------ Create Product ------------------------------ */
	async createProduct(input: CreateProductInput, role: Role) {
		const { productVariants, ...productData } = input
		return await this.prisma.$transaction(async tx => {
			const existing = await checkUniqueProduct(tx, productData.productName, productData.recipeUnit)

			if (existing)
				throw new NotFoundException(
					`Product with name ${productData.productName} and recipeUnit ${productData.recipeUnit} already exists`
				)

			const hasVariants = !!productVariants?.length

			return this.prisma.product.create({
				data: {
					...productData,
					isActive: role === Role.ADMIN ? hasVariants : false,
					...(hasVariants && {
						productVariants: {
							create: productVariants.map(po => ({
								pricingAmount: po.pricingAmount,
								pricingUnit: po.pricingUnit,
								price: po.price,
								label: po.label,
								variantNote: po.variantNote
							}))
						}
					})
				},
				include: {
					productVariants: true
				}
			})
		})
	}

	/* ========================================================================== */
	/*                                    ADMIN                                   */
	/* ========================================================================== */

	// * ------------------------------- All Products ------------------------------ */
	async getAllProducts() {
		return this.prisma.product.findMany({
			include: {
				productVariants: true
			}
		})
	}

	async getWithoutVariants() {
		return this.prisma.product.findMany({
			where: {
				productVariants: { none: {} }
			},
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
