import { InputType, PartialType } from '@nestjs/graphql'
import { CreateProductFamilyInput } from './create-product-family.input'

@InputType()
export class UpdateProductFamilyInput extends PartialType(CreateProductFamilyInput) {}
