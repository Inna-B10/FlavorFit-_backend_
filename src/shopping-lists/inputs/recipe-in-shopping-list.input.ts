import { Field, InputType } from '@nestjs/graphql'
import { IsString, MaxLength } from 'class-validator'

@InputType()
export class RecipeInShoppingListInput {
	@Field(() => String)
	@IsString()
	@MaxLength(30)
	listId: string

	@Field(() => String)
	@IsString()
	@MaxLength(30)
	recipeId: string
}
