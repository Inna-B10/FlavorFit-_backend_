import { registerEnumType } from '@nestjs/graphql'
import { Difficulty, OrderStatus, RecipeUnit, Role, SaleUnit } from 'prisma/generated/prisma/enums'

registerEnumType(RecipeUnit, { name: 'RecipeUnit' })
registerEnumType(SaleUnit, { name: 'SaleUnit' })
registerEnumType(Role, { name: 'Role' })
registerEnumType(Difficulty, { name: 'Difficulty' })
registerEnumType(OrderStatus, { name: 'OrderStatus' })

export { Difficulty, OrderStatus, RecipeUnit, Role, SaleUnit }
