import { BadRequestException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/client'
import { UpdateRecipeInput } from 'src/recipes/inputs/recipe/update-recipe.input'
import { CreateRecipeStepInput } from 'src/recipes/inputs/step/create-step.input'
import { UpdateRecipeStepInput } from 'src/recipes/inputs/step/update-step.input'

//* ----------------------------- Normalize Steps ----------------------------- */
export function normalizeSteps(steps?: CreateRecipeStepInput[]) {
	if (!steps?.length) return undefined

	// normalize order to 1..N if not provided
	const normalized = steps.map((s, index) => ({
		stepNumber: s.stepNumber ?? index + 1,
		title: s.title,
		description: s.description
	}))

	// ensure unique stepNumber values
	const stepNumbers = normalized.map(s => s.stepNumber)
	const duplicates = stepNumbers.filter((o, i) => stepNumbers.indexOf(o) !== i)
	if (duplicates.length) {
		throw new BadRequestException('Recipe steps have duplicate "stepNumber" values')
	}

	return normalized
}

//* ----------------------------- Build Step Patch ----------------------------- */
export function buildStepPatch(
	step: UpdateRecipeStepInput
): Prisma.RecipeStepUpdateManyMutationInput {
	const data: Prisma.RecipeStepUpdateManyMutationInput = {}

	if (step.stepNumber !== undefined) data.stepNumber = step.stepNumber
	if (step.title !== undefined) data.title = step.title
	if (step.description !== undefined) data.description = step.description

	return data
}

//* ---------------------------- Apply Step Changes ---------------------------- */
export async function applyStepChanges(
	tx: Prisma.TransactionClient,
	recipeId: string,
	input: UpdateRecipeInput
) {
	// delete
	if (input.deleteStepIds?.length) {
		await tx.recipeStep.deleteMany({
			where: { recipeId, recipeStepId: { in: input.deleteStepIds } }
		})
	}

	// update (strict)
	if (input.updateRecipeSteps?.length) {
		const results = await Promise.all(
			input.updateRecipeSteps.map(step =>
				tx.recipeStep.updateMany({
					where: { recipeId, recipeStepId: step.recipeStepId },
					data: buildStepPatch(step)
				})
			)
		)

		const missing = results
			.map((r, i) => ({ count: r.count, id: input.updateRecipeSteps![i].recipeStepId }))
			.filter(x => x.count === 0)

		if (missing.length) {
			throw new BadRequestException(
				`Some steps not found in this recipe: ${missing.map(x => x.id).join(', ')}`
			)
		}
	}

	// add (use same normalization rules as create)
	if (input.addRecipeSteps?.length) {
		const normalized = normalizeSteps(input.addRecipeSteps) ?? []
		await tx.recipeStep.createMany({
			data: normalized.map(s => ({
				recipeId,
				stepNumber: s.stepNumber,
				title: s.title,
				description: s.description
			}))
		})
	}
}
