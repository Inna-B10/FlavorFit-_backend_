import { registerEnumType } from '@nestjs/graphql'
import {
	ActivityLevel,
	Difficulty,
	Gender,
	NutritionGoal,
	OrderStatus,
	RecipeUnit,
	Role,
	SaleUnit
} from 'prisma/generated/prisma/client'

registerEnumType(RecipeUnit, { name: 'RecipeUnit' })
registerEnumType(SaleUnit, { name: 'SaleUnit' })
registerEnumType(Role, { name: 'Role' })
registerEnumType(Difficulty, { name: 'Difficulty' })
registerEnumType(OrderStatus, { name: 'OrderStatus' })
registerEnumType(Gender, { name: 'Gender' })
registerEnumType(ActivityLevel, { name: 'ActivityLevel' })
registerEnumType(NutritionGoal, { name: 'NutritionGoal' })

export { ActivityLevel, Difficulty, Gender, NutritionGoal, OrderStatus, RecipeUnit, Role, SaleUnit }
