import { Transform } from 'class-transformer'
import { registerDecorator, ValidationOptions } from 'class-validator'

export const Trim = () =>
	Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))

export const ToLowerCase = () =>
	Transform(({ value }: { value: unknown }) =>
		typeof value === 'string' ? value.toLowerCase() : value
	)

export const NormalizeEmail = () =>
	Transform(({ value }: { value: unknown }) => {
		if (typeof value !== 'string') return value
		return value.trim().toLowerCase()
	})

export function IsCuid(validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string) {
		registerDecorator({
			name: 'isCuid',
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate(value: unknown): boolean {
					if (typeof value !== 'string') return false

					// CUID v1 format
					return /^c[a-z0-9]{24}$/.test(value)
				},
				defaultMessage() {
					return 'Invalid cuid format'
				}
			}
		})
	}
}
