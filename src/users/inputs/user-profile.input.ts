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
import { Amount, ToDecimal } from 'src/common/class-transformer/decimal/decimal.decorators'
import { Trim } from 'src/common/class-transformer/string.decorators'
import { ActivityLevel, Gender, NutritionGoal } from 'src/graphql/graphql.enums'

//* ------------------------------- User Update ------------------------------ */
@InputType()
export class UserUpdateInput {
	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MinLength(2, { message: 'First name is too short' })
	@MaxLength(64, { message: 'First name is too long' })
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
	@MinLength(2, { message: 'Full name is too short' })
	@MaxLength(120, { message: 'Full name is too long' })
	fullName?: string

	@Field(() => Gender, { nullable: true })
	@IsOptional()
	@IsEnum(Gender)
	gender?: Gender

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt({ message: 'Birth year must be a number' })
	@Min(1900, { message: 'Birth year: the value is invalid' })
	@Max(2022, { message: 'Birth year: the value is invalid' })
	birthYear?: number

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MinLength(1, { message: 'Bio is too short' })
	@MaxLength(1000, { message: 'Bio is too long' })
	bio?: string
}

//* -------------------------- FitnessProfile Update ------------------------- */
@InputType()
export class FitnessProfileUpdateInput {
	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt({ message: 'Height must be a number' })
	@Min(1, { message: 'Height: the value is invalid' })
	@Max(300, { message: 'Height: the value is invalid' })
	heightCm?: number

	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	@Type(() => String)
	@ToDecimal()
	@Amount()
	currentWeight?: Decimal

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt({ message: 'Target weight must be a number' })
	@Min(1, { message: 'Target weight: the value is invalid' })
	targetWeight?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt({ message: 'Chest must be a number' })
	@Min(1, { message: 'Chest: the value is invalid' })
	chestCm?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt({ message: 'Waist must be a number' })
	@Min(1, { message: 'Waist: the value is invalid' })
	waistCm?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt({ message: 'Thigh must be a number' })
	@Min(1, { message: 'Thigh: the value is invalid' })
	thighCm?: number

	@Field(() => Int, { nullable: true })
	@IsOptional()
	@IsInt({ message: 'Arm must be a number' })
	@Min(1, { message: 'Arm: the value is invalid' })
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
