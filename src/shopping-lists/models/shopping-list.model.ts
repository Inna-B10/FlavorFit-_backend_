import { Field, ObjectType } from '@nestjs/graphql'
import { ShoppingListItemModel } from './shopping-list-item.model'

@ObjectType()
export class ShoppingListModel {
	@Field()
	listId: string

	@Field(() => [ShoppingListItemModel])
	listItems: ShoppingListItemModel[]

	@Field(() => Boolean)
	hasOutdatedRecipes: boolean

	@Field()
	createdAt: Date

	@Field()
	updatedAt: Date
}
