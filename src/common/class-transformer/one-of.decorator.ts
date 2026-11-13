import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator'

export function OneOf(properties: string[], validationOptions?: ValidationOptions) {
	return (object: object, propertyName: string) => {
		registerDecorator({
			name: 'oneOf',
			target: object.constructor,
			propertyName,
			constraints: [properties],
			options: validationOptions,
			validator: {
				validate(_: unknown, args: ValidationArguments) {
					const [fields] = args.constraints as [string[]]

					const provided = fields.filter(field => {
						const value = (args.object as Record<string, unknown>)[field]
						return value !== undefined && value !== null && value !== ''
					})

					return provided.length === 1
				},
				defaultMessage(args: ValidationArguments) {
					const [fields] = args.constraints as [string[]]
					return `Exactly one of ${fields.join(' or ')} must be provided`
				}
			}
		})
	}
}
