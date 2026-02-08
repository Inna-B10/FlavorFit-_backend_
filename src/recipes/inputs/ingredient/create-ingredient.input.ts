import { Field, InputType } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { RecipeUnit } from 'src/graphql/graphql.enums'

@InputType()
export class CreateIngredientInput {
	// If exists in catalog
	@Field({ nullable: true })
	productId?: string

	// If product doesn't exist - create it
	@Field({ nullable: true })
	productName?: string

	@Field({ nullable: true })
	productIconUrl?: string

	@Field(() => RecipeUnit, { nullable: true })
	productRecipeUnit?: RecipeUnit

	@Field(() => Decimal)
	quantity: Decimal

	@Field(() => RecipeUnit)
	recipeUnit: RecipeUnit

	@Field({ nullable: true })
	note?: string
}
