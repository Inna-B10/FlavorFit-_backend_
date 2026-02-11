import { Field, InputType, Int } from '@nestjs/graphql'
import { ActivityLevel, NutritionGoal } from 'prisma/generated/prisma/enums'
import { Gender } from 'src/graphql/graphql.enums'

//* ------------------------------- User Update ------------------------------ */
@InputType()
export class UserUpdateInput {
	@Field({ nullable: true })
	firstName?: string

	@Field({ nullable: true })
	avatarUrl?: string
}

//* ---------------------------- UserProfile Update -------------------------- */
@InputType()
export class UserProfileUpdateInput {
	@Field({ nullable: true })
	fullName?: string

	@Field(() => Gender, { nullable: true })
	gender?: Gender

	@Field(() => Int, { nullable: true })
	birthYear?: number

	@Field({ nullable: true })
	bio?: string
}

//* -------------------------- FitnessProfile Update ------------------------- */
@InputType()
export class FitnessProfileUpdateInput {
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
}

//* --------------------------- FullProfile Update --------------------------- */
@InputType()
export class FullProfileUpdateInput {
	@Field(() => UserUpdateInput, { nullable: true })
	user?: UserUpdateInput

	@Field(() => UserProfileUpdateInput, { nullable: true })
	profile?: UserProfileUpdateInput

	@Field(() => FitnessProfileUpdateInput, { nullable: true })
	fitnessProfile?: FitnessProfileUpdateInput
}
