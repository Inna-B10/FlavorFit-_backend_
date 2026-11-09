import { Field, InputType, Int } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import {
	ArrayMaxSize,
	ArrayMinSize,
	IsArray,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	Min,
	MinLength,
	ValidateNested
} from 'class-validator'
import { Trim } from 'src/common/class-transformer/string.decorators'
import { Difficulty, DishType } from 'src/graphql/graphql.enums'
import {
	CreateIngredientDraftInput,
	CreateIngredientInput
} from '../ingredient/create-ingredient.input'
import { NutritionFactsInput } from '../nutrition-facts.input'
import { CreateRecipeStepInput } from '../step/create-step.input'

@InputType({ isAbstract: true })
export class RecipeBaseInput {
	@Field(() => String)
	@IsString()
	@Trim()
	@MinLength(1)
	@MaxLength(200)
	title!: string

	@Field(() => String)
	@IsString()
	@Trim()
	@MinLength(1)
	@MaxLength(500)
	description!: string

	@Field(() => Difficulty)
	@IsEnum(Difficulty)
	difficulty!: Difficulty

	@Field(() => DishType)
	@IsEnum(DishType)
	dishType!: DishType

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	cookingTime?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(0)
	calories?: number

	@Field(() => NutritionFactsInput, { nullable: true })
	@IsOptional()
	@ValidateNested()
	@Type(() => NutritionFactsInput)
	nutritionFacts?: NutritionFactsInput

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
	@ArrayMaxSize(20)
	tags?: string[]

	@Field(() => [CreateRecipeStepInput], { nullable: true })
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateRecipeStepInput)
	recipeSteps?: CreateRecipeStepInput[]
}

@InputType()
export class CreateRecipeInput extends RecipeBaseInput {
	@Field(() => String)
	@IsString()
	@Trim()
	@MaxLength(160)
	@MinLength(1)
	@Matches(/^[a-z0-9-]+$/)
	slug!: string

	@Field(() => [CreateIngredientInput])
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => CreateIngredientInput)
	ingredients!: CreateIngredientInput[]
}

@InputType()
export class CreateRecipeDraftInput extends RecipeBaseInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MaxLength(160)
	@MinLength(1)
	@Matches(/^[a-z0-9-]+$/)
	slug?: string

	@Field(() => [CreateIngredientDraftInput])
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => CreateIngredientDraftInput)
	ingredients!: CreateIngredientDraftInput[]
}
