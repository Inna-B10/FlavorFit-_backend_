import { registerEnumType } from '@nestjs/graphql'
import { RecipeUnit, Role, SaleUnit } from 'prisma/generated/prisma/enums'

registerEnumType(RecipeUnit, { name: 'RecipeUnit' })
registerEnumType(SaleUnit, { name: 'SaleUnit' })
registerEnumType(Role, { name: 'Role' })

export { RecipeUnit, Role, SaleUnit }
