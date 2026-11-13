import { plainToInstance } from 'class-transformer'
import { IsOptional, validate } from 'class-validator'
import { OneOf } from 'src/common/class-transformer/one-of.decorator'

class TestIngredientInput {
	@OneOf(['productId', 'rawProductName'])
	private readonly ingredientSourceValidation = true

	@IsOptional()
	productId?: string

	@IsOptional()
	rawProductName?: string
}

describe('OneOf decorator', () => {
	it('should pass when productId is provided', async () => {
		const input = plainToInstance(TestIngredientInput, {
			productId: 'cm12345678901234567890123'
		})

		const errors = await validate(input)

		expect(errors).toHaveLength(0)
	})

	it('should pass when rawProductName is provided', async () => {
		const input = plainToInstance(TestIngredientInput, {
			rawProductName: 'Авокадо'
		})

		const errors = await validate(input)

		expect(errors).toHaveLength(0)
	})

	it('should fail when both fields are provided', async () => {
		const input = plainToInstance(TestIngredientInput, {
			productId: 'cm12345678901234567890123',
			rawProductName: 'Авокадо'
		})

		const errors = await validate(input)

		expect(errors.length).toBeGreaterThan(0)
	})

	it('should fail when neither field is provided', async () => {
		const input = plainToInstance(TestIngredientInput, {})

		const errors = await validate(input)

		expect(errors.length).toBeGreaterThan(0)
	})
})
