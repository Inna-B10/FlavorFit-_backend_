import { BadRequestException } from '@nestjs/common'
import { CreateRecipeStepInput } from 'src/recipes/inputs/recipe-step/create-recipe-step'

export function buildStepsData(steps?: CreateRecipeStepInput[]) {
	if (!steps?.length) return undefined

	// Normalize order to 1..N if not provided
	const normalized = steps.map((s, index) => ({
		stepNumber: s.stepNumber ?? index + 1,
		title: s.title,
		description: s.description
	}))

	// Ensure unique stepNumber values
	const stepNumbers = normalized.map(s => s.stepNumber)
	const duplicates = stepNumbers.filter((o, i) => stepNumbers.indexOf(o) !== i)
	if (duplicates.length) throw new BadRequestException('Recipe steps have duplicate "order" values')

	return normalized
}
