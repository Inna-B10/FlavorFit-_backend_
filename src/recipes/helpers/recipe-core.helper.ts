import { BadRequestException, NotFoundException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/prisma/client'
import { Difficulty } from 'src/graphql/graphql.enums'
import { CreateRecipeInput } from 'src/recipes/inputs/recipe/create-recipe.input'
import { UpdateRecipeInput } from 'src/recipes/inputs/recipe/update-recipe.input'

type IngredientRefInput = CreateRecipeInput['ingredients'][number]

//* --------------------------- EnsureRecipeExists --------------------------- */
export async function ensureRecipeExists(
	tx: Prisma.TransactionClient,
	recipeId: string
): Promise<void> {
	const exists = await tx.recipe.findUnique({
		where: { recipeId },
		select: { recipeId: true }
	})

	if (!exists) throw new NotFoundException(`Recipe with ID '${recipeId}' not found`)
}

//* ------------------------ ValidateCreateRecipeInput ----------------------- */
export function validateCreateRecipeInput(
	authorId: string,
	input: {
		slug: string
		title: string
		description: string
		difficulty: Difficulty
		ingredients: IngredientRefInput[]
	}
) {
	// author
	if (!authorId || authorId.trim() === '') throw new BadRequestException('authorId is required')

	// recipe basics
	if (!input.slug?.trim()) throw new BadRequestException('slug is required')
	if (!input.title?.trim()) throw new BadRequestException('title is required')
	if (!input.description?.trim()) throw new BadRequestException('description is required')
	if (!input.difficulty) throw new BadRequestException('difficulty is required')

	// ingredients
	if (!input.ingredients?.length) throw new BadRequestException('ingredients are required')

	// prevent duplicate products inside one recipe by productId (because of @@unique([recipeId, productId]))
	const providedProductIds = input.ingredients
		.map(i => i.productId)
		.filter((v): v is string => Boolean(v))

	const duplicates = providedProductIds.filter((id, idx) => providedProductIds.indexOf(id) !== idx)
	if (duplicates.length) {
		throw new BadRequestException(
			`Duplicate productId in ingredients: ${[...new Set(duplicates)].join(', ')}`
		)
	}
}

//* ---------------------------- BuildRecipePatch ---------------------------- */
export function buildRecipePatch(
	input: UpdateRecipeInput,
	shouldBumpIngredientsVersion?: boolean
): Prisma.RecipeUpdateInput {
	const data: Prisma.RecipeUpdateInput = {}

	if (input.slug !== undefined) data.slug = input.slug
	if (input.title !== undefined) data.title = input.title
	if (input.description !== undefined) data.description = input.description
	if (input.difficulty !== undefined) data.difficulty = input.difficulty
	if (input.calories !== undefined) data.calories = input.calories
	if (input.cookingTime !== undefined) data.cookingTime = input.cookingTime
	if (shouldBumpIngredientsVersion) data.ingredientsVersion = { increment: 1 }
	return data
}

//* ----------------------------- PatchRecipeCore ---------------------------- */
export async function patchRecipeCore(
	tx: Prisma.TransactionClient,
	recipeId: string,
	input: UpdateRecipeInput,
	shouldBumpIngredientsVersion: boolean = false
): Promise<void> {
	const patch = buildRecipePatch(input, shouldBumpIngredientsVersion)
	if (!Object.keys(patch).length) return

	await tx.recipe.update({
		where: { recipeId },
		data: patch
	})
}

//* ------------------------------ GetRecipeFull ----------------------------- */
export async function getRecipeFull(tx: Prisma.TransactionClient, recipeId: string) {
	return tx.recipe.findUnique({
		where: { recipeId },
		include: {
			ingredients: { include: { product: true } },
			recipeSteps: true,
			tags: true,
			nutritionFacts: true
		}
	})
}
