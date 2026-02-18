import { Field, InputType } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import Decimal from 'decimal.js'
import { Amount, Money, ToDecimal } from 'src/common/class-transformer/decimal/decimal.decorators'
import { Trim } from 'src/common/class-transformer/string.decorators'
import { SaleUnit } from 'src/graphql/graphql.enums'

@InputType()
export class UpdateProductVariantInput {
	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	@Type(() => String)
	@ToDecimal()
	@Amount()
	pricingAmount?: Decimal

	@Field(() => SaleUnit, { nullable: true })
	@IsOptional()
	@IsEnum(SaleUnit)
	pricingUnit?: SaleUnit

	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	@Type(() => String)
	@ToDecimal()
	@Money()
	price?: Decimal

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MinLength(1)
	@MaxLength(120)
	label?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@Trim()
	@MinLength(1)
	@MaxLength(300)
	variantNote?: string
}
