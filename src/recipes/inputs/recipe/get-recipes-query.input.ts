import { Field, InputType, Int } from '@nestjs/graphql'
import {
	ArrayMaxSize,
	IsArray,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	MaxLength,
	Min
} from 'class-validator'
import { Difficulty, DishType, RecipeSort } from 'src/graphql/graphql.enums'

@InputType()
export class RecipesQueryInput {
	@Field(() => Int, { defaultValue: 1 })
	@IsInt()
	@Min(1)
	page: number

	@Field(() => Int, { defaultValue: 10 })
	@IsInt()
	@Min(10)
	limit: number

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(100)
	searchTerm?: string

	@Field(() => Difficulty, { nullable: true })
	@IsOptional()
	@IsEnum(Difficulty)
	difficulty?: Difficulty

	@Field(() => DishType, { nullable: true })
	@IsOptional()
	@IsEnum(DishType)
	dishType?: DishType

	@IsArray()
	@IsString({ each: true })
	@ArrayMaxSize(10)
	@Field(() => [String], { nullable: true })
	tags?: string[]

	@Field(() => RecipeSort, { nullable: true })
	@IsOptional()
	@IsOptional()
	@IsEnum(RecipeSort)
	sort?: RecipeSort
}
