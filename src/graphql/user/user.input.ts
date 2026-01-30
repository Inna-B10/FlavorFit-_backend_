import { Field, InputType, Int } from '@nestjs/graphql'
import { ActivityLevel, Gender, NutritionGoal } from 'prisma/generated/prisma/enums'

@InputType()
export class ProfileUpdateInput {
	@Field({ nullable: true })
	firstName?: string

	@Field({ nullable: true })
	avatarUrl?: string

	@Field({ nullable: true })
	fullName?: string

	@Field(() => Gender, { nullable: true })
	gender?: Gender
	@Field(() => Int, { nullable: true })
	birthYear?: number

	@Field({ nullable: true })
	bio?: string

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
