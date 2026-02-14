import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator'
import Decimal from 'decimal.js'
import { SaleUnit } from 'src/graphql/graphql.enums'
import { DecimalScalar } from 'src/graphql/scalars/decimal.scalar'

@InputType()
export class CreateProductVariantInput {
	@Field(() => DecimalScalar)
	pricingAmount: Decimal

	@Field(() => SaleUnit)
	@IsEnum(SaleUnit)
	pricingUnit: SaleUnit

	@Field(() => Decimal)
	price: Decimal

	@Field(() => String)
	@IsString()
	@MaxLength(120)
	label: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(300)
	note?: string
}
