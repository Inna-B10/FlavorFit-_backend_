import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { rethrowPrismaKnownErrors } from 'src/common/prisma/prisma-errors'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateProductFamilyInput } from '../inputs/product-family/create-product-family.input'
import { UpdateProductFamilyInput } from '../inputs/product-family/update-product-family.input'

@Injectable()
export class ProductFamilyService {
	constructor(private readonly prisma: PrismaService) {}

	// ------------------------------ Normalize Family Name ------------------------------

	private normalizeFamilyName(name: string): string {
		return name.trim().toLowerCase()
	}

	//* ------------------------------ Create Family ------------------------------

	async createFamily(input: CreateProductFamilyInput) {
		const familyName = this.normalizeFamilyName(input.familyName)

		const existing = await this.prisma.productFamily.findFirst({
			where: {
				familyName: {
					equals: familyName,
					mode: 'insensitive'
				}
			}
		})

		if (existing) {
			throw new ConflictException(`Product family '${familyName}' already exists`)
		}

		try {
			return await this.prisma.productFamily.create({
				data: { familyName }
			})
		} catch (e) {
			rethrowPrismaKnownErrors(e)
		}
	}

	//* ------------------------------ All Families ------------------------------

	async getAllFamilies() {
		return await this.prisma.productFamily.findMany({
			orderBy: { familyName: 'asc' }
		})
	}

	//* ------------------------------ Family ById ------------------------------

	async getFamilyById(familyId: string) {
		const family = await this.prisma.productFamily.findUnique({
			where: { familyId }
		})

		if (!family) {
			throw new NotFoundException(`Product family with ID '${familyId}' not found`)
		}

		return family
	}

	//* ------------------------------ Update Family ------------------------------

	async updateFamily(familyId: string, input: UpdateProductFamilyInput) {
		const familyName =
			input.familyName !== undefined ? this.normalizeFamilyName(input.familyName) : undefined

		if (familyName !== undefined) {
			const existing = await this.prisma.productFamily.findFirst({
				where: {
					familyName: {
						equals: familyName,
						mode: 'insensitive'
					}
				}
			})

			if (existing && existing.familyId !== familyId) {
				throw new ConflictException(`Product family '${familyName}' already exists`)
			}
		}

		try {
			return await this.prisma.productFamily.update({
				where: { familyId },
				data: {
					...(familyName !== undefined ? { familyName } : {})
				}
			})
		} catch (e) {
			rethrowPrismaKnownErrors(e, {
				notFound: { type: 'productFamily', id: familyId }
			})
		}
	}

	//* ------------------------------ Delete Family ------------------------------

	async deleteFamily(familyId: string) {
		try {
			return await this.prisma.productFamily.delete({
				where: { familyId }
			})
		} catch (e) {
			rethrowPrismaKnownErrors(e, {
				notFound: { type: 'productFamily', id: familyId }
			})
		}
	}
}
