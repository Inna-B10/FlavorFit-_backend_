import { Field, InputType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { RecipeUnit } from 'src/graphql/graphql.enums'

@InputType()
export class UpdateRecipeIngredientInput {
	@Field()
	recipeIngredientId: string

	@Field(() => Decimal, { nullable: true })
	quantity?: Decimal

	@Field(() => RecipeUnit, { nullable: true })
	recipeUnit?: RecipeUnit

	@Field({ nullable: true })
	note?: string
}
