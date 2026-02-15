import { Field, InputType, Int } from '@nestjs/graphql'
import { IsEnum, IsInt, IsOptional, IsString, IsUrl, Max, MaxLength, Min } from 'class-validator'
import Decimal from 'decimal.js'
import { Amount } from 'src/common/class-transformer/decimal/decimal.decorators'
import { ActivityLevel, Gender, NutritionGoal } from 'src/graphql/graphql.enums'
import { DecimalScalar } from 'src/graphql/scalars/decimal.scalar'

//* ------------------------------- User Update ------------------------------ */
@InputType()
export class UserUpdateInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(64)
	firstName?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@MaxLength(500)
	@IsUrl()
	avatarUrl?: string
}

//* ---------------------------- UserProfile Update -------------------------- */
@InputType()
export class UserProfileUpdateInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
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
	profile?: UserProfileUpdateInput

	@Field(() => FitnessProfileUpdateInput, { nullable: true })
	fitnessProfile?: FitnessProfileUpdateInput
}
