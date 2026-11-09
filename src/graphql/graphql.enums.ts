import { registerEnumType } from '@nestjs/graphql'
import {
	ActivityLevel,
	CulinaryForm,
	Difficulty,
	DishType,
	Gender,
	NutritionGoal,
	OrderStatus,
	RecipeSort,
	RecipeUnit,
	Role,
	SaleUnit
} from 'prisma/generated/client'

registerEnumType(RecipeUnit, { name: 'RecipeUnit' })
registerEnumType(SaleUnit, { name: 'SaleUnit' })
registerEnumType(Role, { name: 'Role' })
registerEnumType(Difficulty, { name: 'Difficulty' })
registerEnumType(DishType, { name: 'DishType' })
registerEnumType(OrderStatus, { name: 'OrderStatus' })
registerEnumType(Gender, { name: 'Gender' })
registerEnumType(ActivityLevel, { name: 'ActivityLevel' })
registerEnumType(NutritionGoal, { name: 'NutritionGoal' })
registerEnumType(RecipeSort, { name: 'RecipeSort' })
registerEnumType(CulinaryForm, { name: 'CulinaryForm' })

export {
	ActivityLevel,
	CulinaryForm,
	Difficulty,
	DishType,
	Gender,
	NutritionGoal,
	OrderStatus,
	RecipeSort,
	RecipeUnit,
	Role,
	SaleUnit
}
