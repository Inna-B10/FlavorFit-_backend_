import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RecipeInShoppingListInput {
	@Field()
	listId: string

	@Field()
	recipeId: string
}
