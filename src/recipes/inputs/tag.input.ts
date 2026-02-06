import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RecipeTagInput {
	@Field(() => String, { nullable: true })
	name?: string
}
