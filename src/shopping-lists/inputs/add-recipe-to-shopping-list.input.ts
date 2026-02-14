import { Field, InputType } from '@nestjs/graphql'
import { IsString, MaxLength } from 'class-validator'

@InputType()
export class AddRecipeToShoppingListInput {
	@Field(() => String)
	@IsString()
	@MaxLength(30)
	recipeId: string
}
