import { Field, Int, ObjectType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { RecipeUnit } from 'src/graphql/graphql.enums'
import { RecipeModel } from 'src/recipes/models/recipe.model'

@ObjectType()
export class ShoppingListItemSourceModel {
	@Field()
	recipeId: string

	@Field(() => RecipeModel)
	recipe: RecipeModel

	@Field(() => Decimal)
	amount: Decimal

	@Field(() => RecipeUnit)
	recipeUnit: RecipeUnit

	@Field(() => Int)
	ingredientsVersionUsed: number
}
