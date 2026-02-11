import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RecipeStepModel {
	@Field()
	recipeStepId: string

	@Field(() => Int, { nullable: true })
	stepNumber?: number

	@Field({ nullable: true })
	title?: string

	@Field()
	content: string

	@Field()
	recipeId: string
}
