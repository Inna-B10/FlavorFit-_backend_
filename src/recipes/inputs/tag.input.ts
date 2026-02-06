import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RecipeTagInput {
	@Field(() => String)
	name: string
}
