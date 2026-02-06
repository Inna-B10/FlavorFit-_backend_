import { BadRequestException } from '@nestjs/common'
import { Difficulty } from 'src/graphql/graphql.enums'
import { CreateRecipeInput } from 'src/recipes/inputs/recipe/create-recipe.input'

type IngredientRefInput = CreateRecipeInput['ingredients'][number]

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
	// Author
	if (!authorId || authorId.trim() === '') throw new BadRequestException('authorId is required')

	// Recipe basics
	if (!input.slug?.trim()) throw new BadRequestException('slug is required')
	if (!input.title?.trim()) throw new BadRequestException('title is required')
	if (!input.description?.trim()) throw new BadRequestException('description is required')
	if (!input.difficulty) throw new BadRequestException('difficulty is required')

	// Ingredients
	if (!input.ingredients?.length) throw new BadRequestException('ingredients are required')

	// Prevent duplicate products inside one recipe by productId (because of @@unique([recipeId, productId]))
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
