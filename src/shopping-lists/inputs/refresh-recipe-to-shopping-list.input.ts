import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RefreshRecipeToShoppingListInput {
	@Field()
	listId: string

	@Field()
	recipeId: string
}
