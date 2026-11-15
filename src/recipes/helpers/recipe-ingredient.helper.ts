import { BadRequestException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/client'
import { UpdateIngredientInput } from 'src/recipes/inputs/ingredient/update-ingredient.input'
import { UpdateRecipeInput } from 'src/recipes/inputs/recipe/update-recipe.input'
import { resolveIngredientProductId } from './recipe-ingredient-products.helper'

//* ------------------------- Apply Ingredient Changes ------------------------- */
export async function applyIngredientChanges(
	tx: Prisma.TransactionClient,
	recipeId: string,
	input: UpdateRecipeInput
) {
	// delete ingredients (if provided)
	if (input.deleteIngredientIds?.length) {
		await tx.ingredient.deleteMany({
			where: { recipeId, ingredientId: { in: input.deleteIngredientIds } }
		})
	}

	// update ingredients (patch existing rows)
	if (input.updateIngredients?.length) {
		const patches = (input.updateIngredients ?? [])
			.map(ing => ({ ing, data: buildIngredientPatch(ing) }))
			.filter(x => Object.keys(x.data).length > 0)

		const results = await Promise.all(
			patches.map(({ ing, data }) =>
				tx.ingredient.updateMany({
					where: { recipeId, ingredientId: ing.ingredientId },
					data
				})
			)
		)

		// strict mode (optional): if some id didn't match -> error
		const notFound = results
			.map((result, index) => ({
				count: result.count,
				id: patches[index].ing.ingredientId
			}))
			.filter(item => item.count === 0)

		if (notFound.length) {
			throw new BadRequestException(
				`Some ingredients not found in this recipe: ${notFound.map(x => x.id).join(', ')}`
			)
		}
	}

	// Add ingredients
	if (input.addIngredients?.length) {
		const productIds: string[] = []

		for (const ing of input.addIngredients) {
			productIds.push(await resolveIngredientProductId(tx, ing.productId))
		}

		await tx.ingredient.createMany({
			data: input.addIngredients.map((ing, idx) => ({
				recipeId,
				productId: productIds[idx],
				quantity: ing.quantity,
				recipeUnit: ing.recipeUnit,
				ingredientNote: ing.ingredientNote ?? null
			}))
		})
	}
}

//* -------------------------- Build Ingredient Patch -------------------------- */
export function buildIngredientPatch(
	ing: UpdateIngredientInput
): Prisma.IngredientUpdateManyMutationInput {
	const data: Prisma.IngredientUpdateManyMutationInput = {}

	if (ing.quantity !== undefined) data.quantity = ing.quantity
	if (ing.recipeUnit !== undefined) data.recipeUnit = ing.recipeUnit
	if (ing.ingredientNote !== undefined) data.ingredientNote = ing.ingredientNote

	return data
}

//* ---------------------- Check Ingredients Duplicates ---------------------- */
export async function assertNoDuplicateProductIds(
	tx: Prisma.TransactionClient,
	ingredients: { productId?: string }[]
) {
	const seen = new Set<string>()
	const dupIds = new Set<string>()

	// 1. Собираем все дублирующиеся ID без обращений к БД
	for (const i of ingredients) {
		if (!i.productId) continue

		if (seen.has(i.productId)) {
			dupIds.add(i.productId)
		} else {
			seen.add(i.productId)
		}
	}

	// 2. Если дубликатов нет, выходим сразу без запроса в базу
	if (!dupIds.size) return

	// 3. Получаем названия всех дубликатов одним запросом
	const products = await tx.product.findMany({
		where: {
			productId: { in: [...dupIds] }
		},
		select: {
			productId: true,
			productName: true
		}
	})

	// Сопоставляем ID с названиями (если продукт не найден в БД, оставляем сам ID)
	const productNamesMap = new Map(products.map(p => [p.productId, p.productName] as const))

	const duplicateNames = [...dupIds].map(id => productNamesMap.get(id) ?? id)

	throw new BadRequestException(`Duplicate ingredients: ${duplicateNames.join(', ')}`)
}
