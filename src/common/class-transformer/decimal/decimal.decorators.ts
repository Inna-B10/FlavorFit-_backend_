import { applyDecorators } from '@nestjs/common'
import { registerDecorator, ValidationOptions } from 'class-validator'
import Decimal from 'decimal.js'
import { normalizeDecimalInput } from './decimal-normalize'

/** --- low-level validators (tiny + reusable) --- */

function IsDecimalJs(options?: ValidationOptions) {
	return (obj: object, prop: string) =>
		registerDecorator({
			name: 'IsDecimalJs',
			target: obj.constructor,
			propertyName: prop,
			options,
			validator: {
				validate(v: unknown): boolean {
					return v instanceof Decimal && v.isFinite()
				}
			}
		})
}

function DecimalMin(min: string, options?: ValidationOptions) {
	const minDec = new Decimal(min)
	return (obj: object, prop: string) =>
		registerDecorator({
			name: 'DecimalMin',
			target: obj.constructor,
			propertyName: prop,
			options,
			validator: {
				validate(v: unknown): boolean {
					return v instanceof Decimal && v.greaterThanOrEqualTo(minDec)
				}
			}
		})
}

function DecimalMax(max: string, options?: ValidationOptions) {
	const maxDec = new Decimal(max)
	return (obj: object, prop: string) =>
		registerDecorator({
			name: 'DecimalMax',
			target: obj.constructor,
			propertyName: prop,
			options,
			validator: {
				validate(v: unknown): boolean {
					return v instanceof Decimal && v.lessThanOrEqualTo(maxDec)
				}
			}
		})
}

function DecimalScale(scale: number, options?: ValidationOptions) {
	return (obj: object, prop: string) =>
		registerDecorator({
			name: 'DecimalScale',
			target: obj.constructor,
			propertyName: prop,
			options,
			validator: {
				validate(v: unknown): boolean {
					return v instanceof Decimal && v.decimalPlaces() <= scale
				}
			}
		})
}

/** --- FAMILY decorators (what you actually use in Inputs) --- */

/** Money: price, pricingAmount, totals */
export function Money(options?: { min?: string; max?: string; scale?: number }) {
	const min = options?.min ?? '0'
	const max = options?.max ?? '999999.99'
	const scale = options?.scale ?? 2

	return applyDecorators(
		IsDecimalJs({ message: 'Must be a valid decimal' }),
		DecimalMin(min, { message: `Must be >= ${min}` }),
		DecimalMax(max, { message: `Must be <= ${max}` }),
		DecimalScale(scale, { message: `Max ${scale} decimal places` })
	)
}

/** Amount: goodsCount, ingredient.quantity (kg, g, tsp, etc.) */
export function Amount(options?: { min?: string; max?: string; scale?: number }) {
	const min = options?.min ?? '0.001'
	const max = options?.max ?? '100000'
	const scale = options?.scale ?? 3

	return applyDecorators(
		IsDecimalJs({ message: 'Must be a valid decimal' }),
		DecimalMin(min, { message: `Must be >= ${min}` }),
		DecimalMax(max, { message: `Must be <= ${max}` }),
		DecimalScale(scale, { message: `Max ${scale} decimal places` })
	)
}

/** Nutrition: protein, fiber, etc. */
export function Nutrition(options?: { min?: string; max?: string; scale?: number }) {
	const min = options?.min ?? '0'
	const max = options?.max ?? '1000'
	const scale = options?.scale ?? 2

	return applyDecorators(
		IsDecimalJs({ message: 'Must be a valid decimal' }),
		DecimalMin(min, { message: `Must be >= ${min}` }),
		DecimalMax(max, { message: `Must be <= ${max}` }),
		DecimalScale(scale, { message: `Max ${scale} decimal places` })
	)
}

export function AmountString(options?: { min?: string; max?: string; scale?: number }) {
	const min = new Decimal(options?.min ?? '0.001')
	const max = new Decimal(options?.max ?? '100000')
	const scale = options?.scale ?? 3

	return (obj: object, prop: string) =>
		registerDecorator({
			name: 'AmountString',
			target: obj.constructor,
			propertyName: prop,
			options: {
				message: `Must be a valid amount (min ${min.toString()}, max ${max.toString()}, max ${scale} decimals)`,
				...((options as unknown) ?? {})
			} as ValidationOptions,
			validator: {
				validate(v: unknown): boolean {
					const normalized = normalizeDecimalInput(v)
					if (normalized === null) return false

					// Strict numeric format after normalization
					if (!/^-?\d+(\.\d+)?$/.test(normalized)) return false

					let dec: Decimal
					try {
						dec = new Decimal(normalized)
					} catch {
						return false
					}

					if (!dec.isFinite()) return false
					if (dec.decimalPlaces() > scale) return false
					if (dec.lessThan(min)) return false
					if (dec.greaterThan(max)) return false

					return true
				}
			}
		})
}
