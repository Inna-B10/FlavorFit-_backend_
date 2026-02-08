import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/prisma/client'

type NotFoundContext =
	| { type: 'recipe'; id?: string }
	| { type: 'product'; id?: string }
	| { type: 'productVariant'; id?: string }
	| { type: 'custom'; message: string }

type PrismaErrorContext = {
	slug?: string
	notFound?: NotFoundContext
}

export function rethrowPrismaKnownErrors(e: unknown, ctx?: PrismaErrorContext): never {
	if (e instanceof Prisma.PrismaClientKnownRequestError) {
		//# ---------- NOT FOUND ----------
		if (e.code === 'P2025') {
			const nf = ctx?.notFound

			if (!nf) {
				throw new NotFoundException('Record not found')
			}

			switch (nf.type) {
				case 'recipe':
					throw new NotFoundException(`Recipe${nf.id ? ` with ID '${nf.id}'` : ''} not found`)
				case 'product':
					throw new NotFoundException(`Product${nf.id ? ` with ID '${nf.id}'` : ''} not found`)
				case 'productVariant':
					throw new NotFoundException(
						`Product variant${nf.id ? ` with ID '${nf.id}'` : ''} not found`
					)
				case 'custom':
					throw new NotFoundException(nf.message)
			}
		}

		//# ---------- UNIQUE ----------
		if (e.code === 'P2002') {
			const target = (e.meta?.target as string[] | undefined)?.join(', ') ?? ''

			// slug unique
			if (target.includes('slug')) {
				throw new ConflictException(`Recipe slug '${ctx?.slug ?? ''}' already exists`)
			}

			// ingredient unique: @@unique([recipeId, productId])
			if (target.includes('recipeId') && target.includes('productId')) {
				throw new BadRequestException('This ingredient already exists in the recipe')
			}
			// @@unique([listId, recipeId])
			else if (target.includes('recipeId') && target.includes('listId')) {
				throw new BadRequestException('This recipe is already added to the shopping list')
			}

			throw new ConflictException('Unique constraint failed')
		}

		//# ---------- FK ----------
		if (e.code === 'P2003') {
			throw new BadRequestException('Foreign key constraint failed')
		}
	}

	throw e
}
