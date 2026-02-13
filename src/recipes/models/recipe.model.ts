import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Difficulty, DishType } from 'src/graphql/graphql.enums'
import { UserModel } from 'src/users/models/user-profile.model'
import { CommentModel } from '../reactions/models/comment.model'
import { IngredientModel } from './ingredient.model'
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

	@Field(() => DishType)
	dishType: DishType

	@Field(() => [IngredientModel], { nullable: true })
	ingredients?: IngredientModel[]

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

	@Field(() => [CommentModel], { nullable: true })
	comments?: [CommentModel]

	@Field(() => Int)
	likesCount: number

	@Field(() => Int)
	ingredientsVersion: number
}
