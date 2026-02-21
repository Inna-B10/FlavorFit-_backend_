import { Field, Int, ObjectType } from '@nestjs/graphql'
import Decimal from 'decimal.js'

import { ActivityLevel, Gender, NutritionGoal, Role } from 'src/graphql/graphql.enums'

@ObjectType({ isAbstract: true })
export class UserBaseModel {
	@Field()
	userId: string
	@Field()
	email: string
	@Field()
	role: Role
}

//* ---------------------------------- User ---------------------------------- */
@ObjectType()
export class UserModel extends UserBaseModel {
	@Field()
	firstName: string
	@Field({ nullable: true })
	avatarUrl: string
	@Field({ nullable: true })
	verificationToken?: string
}

//* ----------------------------- Fitness Profile ---------------------------- */
@ObjectType()
export class FitnessProfileModel {
	@Field(() => Int, { nullable: true })
	heightCm?: number
	@Field(() => Decimal, { nullable: true })
	currentWeight?: Decimal
	@Field(() => Int, { nullable: true })
	targetWeight?: number
	@Field(() => Int, { nullable: true })
	chestCm?: number
	@Field(() => Int, { nullable: true })
	waistCm?: number
	@Field(() => Int, { nullable: true })
	thighCm?: number
	@Field(() => Int, { nullable: true })
	armCm?: number
	@Field(() => ActivityLevel, { nullable: true })
	activityLevel?: ActivityLevel
	@Field(() => NutritionGoal, { nullable: true })
	nutritionGoal?: NutritionGoal
	@Field()
	updatedAt: Date
}

//* ------------------------------ User Profile ------------------------------ */
@ObjectType()
export class UserProfileModel {
	@Field({ nullable: true })
	fullName?: string
	@Field(() => Gender, { nullable: true })
	gender?: Gender
	@Field(() => Int, { nullable: true })
	birthYear?: number
	@Field({ nullable: true })
	bio?: string
}

//* ------------------------- User With Full Profile ------------------------- */
@ObjectType()
export class UserWithProfileModel {
	@Field(() => UserProfileModel, { nullable: true })
	userProfile?: UserProfileModel

	@Field(() => FitnessProfileModel, { nullable: true })
	fitnessProfile?: FitnessProfileModel
}
