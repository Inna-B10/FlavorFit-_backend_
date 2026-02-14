import { Field, InputType } from '@nestjs/graphql'
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator'
import Decimal from 'decimal.js'
import { SaleUnit } from 'src/graphql/graphql.enums'

@InputType()
export class UpdateProductVariantInput {
	@Field(() => Decimal, { nullable: true })
	@IsOptional()
	pricingAmount?: Decimal

	@Field(() => SaleUnit, { nullable: true })
	@IsOptional()
	@IsEnum(SaleUnit)
	pricingUnit?: SaleUnit

	@Field(() => Decimal, { nullable: true })
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
