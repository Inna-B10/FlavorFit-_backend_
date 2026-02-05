import { Field, InputType } from '@nestjs/graphql'
import { RecipeUnit } from 'src/graphql/graphql.enums'

@InputType()
export class UpdateProductInput {
	@Field({ nullable: true })
	name?: string

	@Field({ nullable: true })
	iconUrl?: string

	@Field(() => RecipeUnit, { nullable: true })
	recipeUnit?: RecipeUnit
}
