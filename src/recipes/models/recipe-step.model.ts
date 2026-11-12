import { Field, Int, ObjectType } from '@nestjs/graphql'

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
