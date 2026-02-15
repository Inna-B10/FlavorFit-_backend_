import { Field, InputType, Int } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import {
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	IsUrl,
	Max,
	MaxLength,
	Min,
	MinLength,
	ValidateNested
} from 'class-validator'
import Decimal from 'decimal.js'
import { Amount } from 'src/common/class-transformer/decimal/decimal.decorators'
import { Trim } from 'src/common/class-transformer/string.decorators'
import { ActivityLevel, Gender, NutritionGoal } from 'src/graphql/graphql.enums'
import { DecimalScalar } from 'src/graphql/scalars/decimal.scalar'

//* ------------------------------- User Update ------------------------------ */
@InputType()
export class UserUpdateInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MinLength(2)
	@MaxLength(64)
	firstName?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsUrl()
	@MaxLength(500)
	avatarUrl?: string
}

//* ---------------------------- UserProfile Update -------------------------- */
@InputType()
export class UserProfileUpdateInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MinLength(2)
	@MaxLength(120)
	fullName?: string

	@Field(() => Gender, { nullable: true })
	@IsOptional()
	@IsEnum(Gender)
	gender?: Gender

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1900)
	@Max(2022)
	birthYear?: number

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MaxLength(1000)
	bio?: string
}

//* -------------------------- FitnessProfile Update ------------------------- */
@InputType()
export class FitnessProfileUpdateInput {
	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(300)
	heightCm?: number

	@Field(() => DecimalScalar, { nullable: true })
	@IsOptional()
	@Amount()
	currentWeight?: Decimal

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	targetWeight?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	chestCm?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	waistCm?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	thighCm?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt()
	@Min(1)
	armCm?: number

	@Field(() => ActivityLevel, { nullable: true })
	@IsOptional()
	@IsEnum(ActivityLevel)
	activityLevel?: ActivityLevel

	@Field(() => NutritionGoal, { nullable: true })
	@IsOptional()
	@IsEnum(NutritionGoal)
	nutritionGoal?: NutritionGoal
}

//* --------------------------- FullProfile Update --------------------------- */
@InputType()
export class FullProfileUpdateInput {
	@Field(() => UserProfileUpdateInput, { nullable: true })
	@IsOptional()
	@ValidateNested()
	@Type(() => UserProfileUpdateInput)
	profile?: UserProfileUpdateInput

	@Field(() => FitnessProfileUpdateInput, { nullable: true })
	@IsOptional()
	@ValidateNested()
	@Type(() => FitnessProfileUpdateInput)
	fitnessProfile?: FitnessProfileUpdateInput
}
