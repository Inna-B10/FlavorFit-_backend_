import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class UpdateRecipeStepInput {
	@Field()
	recipeStepId: string

	@Field(() => Int, { nullable: true })
	stepNumber?: number

	@Field(() => String, { nullable: true })
	title?: string

	@Field(() => String, { nullable: true })
	description?: string
}
