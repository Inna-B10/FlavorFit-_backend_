import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator'
import Decimal from 'decimal.js'
import { Amount, Money } from 'src/common/class-transformer/decimal/decimal.decorators'
import { SaleUnit } from 'src/graphql/graphql.enums'
import { DecimalScalar } from 'src/graphql/scalars/decimal.scalar'

@InputType()
export class UpdateProductVariantInput {
	@Field(() => DecimalScalar, { nullable: true })
	@IsOptional()
	@Amount()
	pricingAmount?: Decimal

	@Field(() => SaleUnit, { nullable: true })
	@IsOptional()
	@IsEnum(SaleUnit)
	pricingUnit?: SaleUnit

	@Field(() => DecimalScalar, { nullable: true })
	@Money()
	@IsOptional()
	price?: Decimal

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(120)
	label?: string

	@Field(() => String, { nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(300)
	note?: string
}
