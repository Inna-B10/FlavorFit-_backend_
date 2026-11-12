import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
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
		if (role !== Role.ADMIN) {
			throw new ForbiddenException('You do not have permission to create products')
		}
		const { productVariants, productName, ...productData } = input
		const normalizedProductName = productName.toLocaleLowerCase()

		return await this.prisma.$transaction(async tx => {
			const existing = await checkUniqueProduct(tx, normalizedProductName, productData.recipeUnit)

			if (existing)
				throw new NotFoundException(
					`Product with name '${normalizedProductName}' and recipeUnit ${productData.recipeUnit} already exists`
				)

			const hasVariants = !!productVariants?.length

			return this.prisma.product.create({
				data: {
					productName: normalizedProductName,
					...productData,
					isActive: hasVariants,
					...(hasVariants && {
						productVariants: {
							create: productVariants.map(po => ({
								pricingAmount: po.pricingAmount,
								pricingUnit: po.pricingUnit,
								price: po.price,
								label: po.label.toLocaleLowerCase(),
								variantNote: po.variantNote?.toLocaleLowerCase()
							}))
						}
					})
				},
				include: {
					productVariants: true,
					family: true
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
				productVariants: true,
				family: true
			}
		})
	}

	//* -------------------------- Get Without Variants -------------------------- */
	async getWithoutVariants() {
		return this.prisma.product.findMany({
			where: {
				productVariants: { none: {} }
			},
			include: {
				productVariants: true,
				family: true
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
				productVariants: true,
				family: true
			}
		})
		if (!product) {
			throw new NotFoundException(`Product with ID '${productId}' not found`)
		}
		return product
	}

	//* ------------------------------ Update Product ------------------------------ */
	async updateProduct(productId: string, input: UpdateProductInput) {
		const { productName, familyId, searchTerms, ...productData } = input

		// Check if familyId exists
		if (familyId) {
			const family = await this.prisma.productFamily.findUnique({
				where: { familyId }
			})

			if (!family) {
				throw new NotFoundException(`Product family with ID '${familyId}' not found`)
			}
		}

		try {
			return await this.prisma.product.update({
				where: { productId },
				data: {
					...productData,

					...(productName !== undefined ? { productName: productName.toLowerCase() } : {}),

					...(familyId !== undefined
						? {
								family: familyId === null ? { disconnect: true } : { connect: { familyId } }
							}
						: {}),

					...(searchTerms !== undefined ? { searchTerms } : {})
				},
				include: { productVariants: true, family: true }
			})
		} catch (e) {
			rethrowPrismaKnownErrors(e, {
				notFound: { type: 'product', id: productId }
			})
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
					productVariants: true,
					family: true
				}
			})
		} catch (e) {
			rethrowPrismaKnownErrors(e, { notFound: { type: 'product', id: productId } })
		}
	}
}
