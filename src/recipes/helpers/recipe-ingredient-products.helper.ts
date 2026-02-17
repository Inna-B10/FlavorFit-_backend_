import { BadRequestException } from '@nestjs/common'
import { Prisma, RecipeUnit } from 'prisma/generated/client'
import { checkUniqueProduct } from 'src/products/helpers/check-unique-product.helper'
import { CreateIngredientInput } from 'src/recipes/inputs/ingredient/create-ingredient.input'

//* --------------------- getOrCreate ProductIds For Ingredients -------------------- */
// convenience wrapper for create/update when we need ids for a list.
export async function getOrCreateProductIdsForIngredients(
	tx: Prisma.TransactionClient,
	ingredients: CreateIngredientInput[]
): Promise<string[]> {
	const productIds: string[] = []
	for (const ing of ingredients) {
		productIds.push(await getOrCreateProductIdForIngredient(tx, ing))
	}
	return productIds
}

//* ---------------------- getOrCreate ProductId For Ingredient --------------------- */
export async function getOrCreateProductIdForIngredient(
	tx: Prisma.TransactionClient,
	ing: CreateIngredientInput
): Promise<string> {
	// case A: existing product/productId provided
	if (ing.productId) {
		const found = await tx.product.findUnique({ where: { productId: ing.productId } })
		if (!found) throw new BadRequestException(`Product with ID '${ing.productId}' not found`)
		return found.productId
	}

	// case B: create product from productName (no variants)
	const productName = (ing.productName || '').trim()
	if (!productName) throw new BadRequestException('Product name is required')

	// if no productRecipeUnit provided, fallback to ingredient recipeUnit
	const recipeUnit = (ing.productRecipeUnit ?? ing.recipeUnit) as unknown as RecipeUnit

	// best-effort reuse by productName + recipeUnit (productName is not unique)
	const existing = await checkUniqueProduct(tx, productName, recipeUnit)

	if (existing) return existing.productId

	const created = await tx.product.create({
		data: { productName, recipeUnit } // variants intentionally not created
	})
	return created.productId
}
