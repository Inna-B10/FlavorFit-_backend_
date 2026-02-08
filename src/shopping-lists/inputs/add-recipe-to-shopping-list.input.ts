import { InputType } from '@nestjs/graphql'

@InputType()
export class AddRecipeToShoppingListInput {
	recipeId: string
}
