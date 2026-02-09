import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { RecipeUnit } from 'src/graphql/graphql.enums'
import { CartItemModel, CartItemRequiredAmountModel } from './models/cart.model'

type CartItemWithRequirements = {
	requirements?: Array<{
		listItem?: {
			requiredAmount: Decimal
			recipeUnit: RecipeUnit
		} | null
	}> | null
}

@Resolver(() => CartItemModel)
export class CartItemResolver {
	@ResolveField(() => [CartItemRequiredAmountModel])
	requiredByRecipes(@Parent() cartItem: CartItemWithRequirements): CartItemRequiredAmountModel[] {
		const requirements = cartItem.requirements ?? []
		if (!requirements.length) return []

		const map = new Map<RecipeUnit, Decimal>()

		for (const r of requirements) {
			const li = r.listItem
			if (!li) continue

			const prev = map.get(li.recipeUnit) ?? new Decimal(0)
			map.set(li.recipeUnit, prev.plus(li.requiredAmount))
		}

		return Array.from(map.entries()).map(([recipeUnit, requiredAmount]) => ({
			recipeUnit,
			requiredAmount
		}))
	}
}
