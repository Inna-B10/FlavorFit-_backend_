import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import { ActivityLevel, Gender, NutritionGoal, Role } from 'prisma/generated/prisma/enums'

registerEnumType(Role, { name: 'Role' })
registerEnumType(Gender, { name: 'Gender' })
registerEnumType(ActivityLevel, { name: 'ActivityLevel' })
registerEnumType(NutritionGoal, { name: 'NutritionGoal' })

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
	@Field({ nullable: true })
	firstName?: string
	@Field({ nullable: true })
	avatarUrl?: string
}

//* ----------------------------- Fitness Profile ---------------------------- */
@ObjectType()
export class FitnessProfileModel {
	@Field(() => Int, { nullable: true })
	heightCm?: number
	@Field(() => Int, { nullable: true })
	currentWeight?: number
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

	//[TODO] нужно ли это будет?? например для “Profile last updated”?
	// @Field()
	// createdAt: Date
	// @Field()
	// updatedAt: Date
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
export class UserWithProfileModel extends UserModel {
	@Field(() => UserProfileModel, { nullable: true })
	userProfile?: UserProfileModel

	@Field(() => FitnessProfileModel, { nullable: true })
	fitnessProfile?: FitnessProfileModel
}
