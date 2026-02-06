import { BadRequestException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/prisma/client'
import { RecipeUnit } from 'src/graphql/graphql.enums'
import { CreateRecipeIngredientInput } from 'src/recipes/inputs/recipe-ingredient/create-recipe-ingredient.input'

export async function resolveProductsForIngredients(
	tx: Prisma.TransactionClient,
	ingredients: CreateRecipeIngredientInput[]
): Promise<string[]> {
	const productIdsByIndex: string[] = []

	for (let idx = 0; idx < ingredients.length; idx++) {
		const ing = ingredients[idx]

		// Case A: Existing product
		if (ing.productId) {
			const found = await tx.product.findUnique({ where: { productId: ing.productId } })
			if (!found) throw new BadRequestException(`Product with ID '${ing.productId}' not found`)
			productIdsByIndex[idx] = found.productId
			continue
		}

		// Case B: Create product from name (no variants)
		const name = (ing.productName || '').trim()
		if (!name)
			throw new BadRequestException('productName is required when productId is not provided')

		const recipeUnit = (ing.productRecipeUnit ?? ing.recipeUnit) as unknown as RecipeUnit

		// Best-effort reuse existing product by name + recipeUnit (name may be non-unique)
		const existing = await tx.product.findFirst({
			where: {
				name: { equals: name, mode: 'insensitive' },
				recipeUnit
			}
		})

		if (existing) {
			productIdsByIndex[idx] = existing.productId
			continue
		}

		// Create product WITHOUT variants (productVariants = empty)
		const created = await tx.product.create({
			data: {
				name,
				// ...(ing.productIconUrl && { productIconUrl: ing.productIconUrl }),
				recipeUnit
			}
		})

		productIdsByIndex[idx] = created.productId
	}

	return productIdsByIndex
}
