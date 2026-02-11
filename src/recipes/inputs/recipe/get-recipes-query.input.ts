import { Field, InputType, Int } from '@nestjs/graphql'
import { Difficulty, DishType } from 'src/graphql/graphql.enums'

@InputType()
export class RecipesQueryInput {
	@Field(() => Int, { defaultValue: 1 })
	page: number

	@Field(() => Int, { defaultValue: 10 })
	limit: number

	@Field(() => String, { nullable: true })
	searchTerm?: string

	@Field(() => Difficulty, { nullable: true })
	difficulty?: Difficulty

	@Field(() => DishType, { nullable: true })
	dishType?: DishType

	@Field(() => [String], { nullable: true })
	tags?: string[]

	@Field(() => String, { nullable: true })
	sort?: 'new' | 'recommended' | 'popular' | 'cookingTime'
}
