import { registerEnumType } from '@nestjs/graphql'
import { Difficulty, RecipeUnit, Role, SaleUnit } from 'prisma/generated/prisma/enums'

registerEnumType(RecipeUnit, { name: 'RecipeUnit' })
registerEnumType(SaleUnit, { name: 'SaleUnit' })
registerEnumType(Role, { name: 'Role' })
registerEnumType(Difficulty, { name: 'Difficulty' })

export { Difficulty, RecipeUnit, Role, SaleUnit }
