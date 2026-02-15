import { Field, InputType } from '@nestjs/graphql'
import { IsCuid, Trim } from 'src/common/class-transformer/string.decorators'

@InputType()
export class AddRecipeToShoppingListInput {
	@Field(() => String)
	@Trim()
	@IsCuid()
	recipeId: string
}
