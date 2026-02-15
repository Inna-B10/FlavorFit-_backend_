import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import Decimal from 'decimal.js'
import { Amount, Money } from 'src/common/class-transformer/decimal/decimal.decorators'
import { Trim } from 'src/common/class-transformer/string.decorators'
import { SaleUnit } from 'src/graphql/graphql.enums'
import { DecimalScalar } from 'src/graphql/scalars/decimal.scalar'

@InputType()
export class CreateProductVariantInput {
	@Field(() => DecimalScalar)
	@Amount()
	pricingAmount: Decimal

	@Field(() => SaleUnit)
	@IsEnum(SaleUnit)
	pricingUnit: SaleUnit

	@Field(() => DecimalScalar)
	@Money()
	price: Decimal

	@Field(() => String)
	@IsString()
	@Trim()
	@MaxLength(120)
	@MinLength(1)
	label: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MinLength(1)
	@MaxLength(300)
	note?: string
}
