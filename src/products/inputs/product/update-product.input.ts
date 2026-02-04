import { Field, InputType } from '@nestjs/graphql'
import { Unit } from 'src/graphql/graphql.enums'

@InputType()
export class UpdateProductInput {
	@Field({ nullable: true })
	name?: string

	@Field({ nullable: true })
	iconUrl?: string

	@Field(() => Unit, { nullable: true })
	recipeUnit?: Unit
}
