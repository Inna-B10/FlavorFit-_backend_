import { registerEnumType } from '@nestjs/graphql'
import { Role, Unit } from 'prisma/generated/prisma/enums'

registerEnumType(Unit, { name: 'Unit' })
registerEnumType(Role, { name: 'Role' })

export { Role, Unit }
