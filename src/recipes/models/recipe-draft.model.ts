import { Field, HideField, Int, ObjectType } from '@nestjs/graphql'
import { Difficulty, DishType, RecipeDraftStatus } from 'src/graphql/graphql.enums'
import { UserModel } from 'src/users/models/user-profile.model'
import { IngredientDraftModel } from './ingredient.model'
import { NutritionFactDraftModel } from './nutrition-facts.model'
import { RecipeStepDraftModel } from './recipe-step.model'

@ObjectType()
export class RecipeDraftModel {
	@Field()
	recipeDraftId!: string

	@Field(() => String, { nullable: true })
	slug?: string

	@Field()
	title!: string

	@Field()
	description!: string

	@Field(() => Int, { nullable: true })
	calories?: number

	@Field(() => Int, { nullable: true })
	cookingTime?: number

	@Field(() => Difficulty)
	difficulty!: Difficulty

	@Field(() => DishType)
	dishType!: DishType

	@Field(() => [String])
	tags!: string[]

	@Field(() => RecipeDraftStatus)
	status!: RecipeDraftStatus

	@Field({ nullable: true })
	reviewNote?: string

	@Field(() => Date, { nullable: true })
	reviewedAt?: Date

	@HideField()
	reviewedBy?: string

	@Field()
	userId!: string

	@Field(() => UserModel, { nullable: true })
	user?: UserModel

	@Field(() => UserModel, { nullable: true })
	reviewer?: UserModel

	@Field(() => String, { nullable: true })
	publishedRecipeId?: string

	@Field(() => [IngredientDraftModel])
	ingredients!: IngredientDraftModel[]

	@Field(() => [RecipeStepDraftModel])
	recipeSteps!: RecipeStepDraftModel[]

	@Field(() => NutritionFactDraftModel, { nullable: true })
	nutritionFacts?: NutritionFactDraftModel

	@Field()
	createdAt!: Date

	@Field()
	updatedAt!: Date
}
