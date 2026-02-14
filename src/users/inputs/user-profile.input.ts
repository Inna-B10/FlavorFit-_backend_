import { Field, InputType, Int } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator'

import { ActivityLevel, Gender, NutritionGoal } from 'src/graphql/graphql.enums'

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
	heightCm?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	currentWeight?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	targetWeight?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	chestCm?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	waistCm?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	thighCm?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
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
