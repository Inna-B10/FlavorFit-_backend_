import { Field, InputType, Int } from '@nestjs/graphql'
import {
	ArrayMaxSize,
	IsArray,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	Min,
	MinLength
} from 'class-validator'
import { Trim } from 'src/common/class-transformer/string.decorators'
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
	@Trim()
	@MaxLength(100, { message: 'Search term is too long' })
	searchTerm?: string

	@Field(() => Difficulty, { nullable: true })
	@IsOptional()
	@IsEnum(Difficulty)
	difficulty?: Difficulty

	@Field(() => DishType, { nullable: true })
	@IsOptional()
	@IsEnum(DishType)
	dishType?: DishType

	@Field(() => [String], { nullable: true })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@MinLength(2, { each: true })
	@MaxLength(24, { each: true })
	@Matches(/^[\p{L}\p{N}][\p{L}\p{N}\s-]*$/u, {
		each: true,
		message: 'Each tag must contain only letters/numbers/spaces/hyphens'
	})
	@ArrayMaxSize(10)
	tags?: string[]

	@Field(() => RecipeSort, { nullable: true })
	@IsOptional()
	@IsEnum(RecipeSort)
	sort?: RecipeSort
}
