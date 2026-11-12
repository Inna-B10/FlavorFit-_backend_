import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
import { Trim } from 'src/common/class-transformer/string.decorators'

@InputType()
export class CreateProductFamilyInput {
	@Field()
	@IsString()
	@Trim()
	@IsNotEmpty()
	@MinLength(2)
	@MaxLength(120)
	familyName: string
}
