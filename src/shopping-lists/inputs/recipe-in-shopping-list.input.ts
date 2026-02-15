import { Field, InputType } from '@nestjs/graphql'
import { IsCuid, Trim } from 'src/common/class-transformer/string.decorators'

@InputType()
export class RecipeInShoppingListInput {
	@Field(() => String)
	@Trim()
	@IsCuid()
	listId: string

	@Field(() => String)
	@Trim()
	@IsCuid()
	recipeId: string
}
