import { BadRequestException } from '@nestjs/common'
import { Prisma } from 'prisma/generated/client'
import { UpdateRecipeInput } from 'src/recipes/inputs/recipe/update-recipe.input'
import { CreateRecipeStepInput } from 'src/recipes/inputs/step/create-step.input'
import { UpdateRecipeStepInput } from 'src/recipes/inputs/step/update-step.input'

//* ----------------------------- Normalize Steps -----------------------------

export function normalizeSteps(steps: CreateRecipeStepInput[]) {
	if (!steps.length) {
		throw new BadRequestException('A recipe must contain at least one step')
	}

	return steps.map((step, index) => ({
		stepNumber: index + 1,
		title: step.title?.toLocaleLowerCase(),
		content: step.content
	}))
}

//* ----------------------------- Build Step Patch -----------------------------

export function buildStepPatch(
	step: UpdateRecipeStepInput
): Prisma.RecipeStepUpdateManyMutationInput {
	const data: Prisma.RecipeStepUpdateManyMutationInput = {}

	if (step.title !== undefined) {
		data.title = step.title.toLocaleLowerCase()
	}

	if (step.content !== undefined) {
		data.content = step.content
	}

	return data
}

//* ---------------------------- Apply Step Changes ----------------------------

export async function applyStepChanges(
	tx: Prisma.TransactionClient,
	recipeId: string,
	input: UpdateRecipeInput
) {
	// Validate duplicate IDs
	const deleteIds = input.deleteStepIds ?? []
	const updateIds = input.updateRecipeSteps?.map(step => step.recipeStepId) ?? []

	if (new Set(deleteIds).size !== deleteIds.length) {
		throw new BadRequestException('Duplicate step IDs in deleteStepIds')
	}

	if (new Set(updateIds).size !== updateIds.length) {
		throw new BadRequestException('Duplicate step IDs in updateRecipeSteps')
	}

	const overlap = deleteIds.filter(id => updateIds.includes(id))

	if (overlap.length) {
		throw new BadRequestException(
			`The same steps cannot be deleted and updated: ${overlap.join(', ')}`
		)
	}

	// Delete
	if (deleteIds.length) {
		const result = await tx.recipeStep.deleteMany({
			where: {
				recipeId,
				recipeStepId: { in: deleteIds }
			}
		})

		if (result.count !== deleteIds.length) {
			throw new BadRequestException('Some steps to delete were not found in this recipe')
		}
	}

	// Update (strict)
	if (input.updateRecipeSteps?.length) {
		const results = await Promise.all(
			input.updateRecipeSteps.map(step =>
				tx.recipeStep.updateMany({
					where: {
						recipeId,
						recipeStepId: step.recipeStepId
					},
					data: buildStepPatch(step)
				})
			)
		)

		const missing = results
			.map((result, index) => ({
				count: result.count,
				id: input.updateRecipeSteps![index].recipeStepId
			}))
			.filter(item => item.count === 0)

		if (missing.length) {
			throw new BadRequestException(
				`Some steps not found in this recipe: ${missing.map(item => item.id).join(', ')}`
			)
		}
	}

	// Add
	if (input.addRecipeSteps?.length) {
		const lastStep = await tx.recipeStep.findFirst({
			where: { recipeId },
			orderBy: { stepNumber: 'desc' },
			select: { stepNumber: true }
		})

		const startNumber = (lastStep?.stepNumber ?? 0) + 1

		await tx.recipeStep.createMany({
			data: input.addRecipeSteps.map((step, index) => ({
				recipeId,
				stepNumber: startNumber + index,
				title: step.title?.toLocaleLowerCase(),
				content: step.content
			}))
		})
	}

	// Ensure at least one step remains
	const stepCount = await tx.recipeStep.count({
		where: { recipeId }
	})

	if (stepCount === 0) {
		throw new BadRequestException('A recipe must contain at least one step')
	}
}
