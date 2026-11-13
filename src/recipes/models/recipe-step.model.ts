import { Field, HideField, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RecipeStepModel {
	@Field()
	recipeStepId: string

	@Field(() => Int)
	stepNumber!: number

	@Field({ nullable: true })
	title?: string

	@Field()
	content: string

	@Field()
	recipeId: string
}

@ObjectType()
export class RecipeStepDraftModel {
	@Field()
	recipeStepDraftId!: string

	@Field(() => Int)
	stepNumber!: number

	@Field({ nullable: true })
	title?: string

	@Field()
	content!: string

	@HideField()
	recipeDraftId!: string
}
