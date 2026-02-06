import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Difficulty } from 'src/graphql/graphql.enums'
import { UserModel } from 'src/users/models/user-profile.model'
import { RecipeIngredientModel } from './ingredient.model'
import { NutritionFactsModel } from './nutrition-facts.model'
import { RecipeStepModel } from './recipe-step.model'
import { RecipeTagModel } from './tag.model'

@ObjectType()
export class RecipeModel {
	@Field()
	recipeId: string

	@Field()
	slug: string

	@Field()
	title: string

	@Field()
	description: string

	@Field(() => Int, { nullable: true })
	calories?: number

	@Field(() => Int, { nullable: true })
	cookingTime?: number

	@Field(() => Difficulty)
	difficulty: Difficulty

	@Field(() => [RecipeIngredientModel])
	ingredients: RecipeIngredientModel[]

	@Field(() => [RecipeStepModel], { nullable: true })
	recipeSteps?: RecipeStepModel[]

	@Field(() => [RecipeTagModel])
	tags: RecipeTagModel[]

	@Field(() => NutritionFactsModel, { nullable: true })
	nutritionFacts?: NutritionFactsModel

	@Field()
	authorId: string

	@Field(() => UserModel, { nullable: true })
	author?: UserModel

	// 	@Field(() => [CommentModel], { nullable: true })
	// 	comments?: [CommentModel]
	//
	// 	@Field(() => [LikeModel], { nullable: true })
	// 	likes?: [LikeModel]
}
