import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class CreateRecipeStepInput {
	@Field(() => Int, { nullable: true })
	stepNumber?: number

	@Field(() => String, { nullable: true })
	title?: string

	@Field(() => String)
	description: string
}
