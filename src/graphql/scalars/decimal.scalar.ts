import { CustomScalar, Scalar } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { Kind, ValueNode } from 'graphql'

@Scalar('Decimal', () => Decimal)
export class DecimalScalar implements CustomScalar<string, Decimal> {
	description = 'Decimal custom scalar type'

	parseValue(value: unknown): Decimal {
		if (value === null || value === undefined || value === '') {
			throw new Error('Decimal value cannot be null or empty')
		}

		if (value instanceof Decimal) return value

		if (typeof value === 'string') {
			return new Decimal(value.replace(',', '.'))
		}

		if (typeof value === 'number' || typeof value === 'bigint') {
			return new Decimal(value)
		}

		throw new Error('Decimal can only parse string, number or bigint values')
	}

	serialize(value: Decimal): string {
		return value.toFixed()
	}

	parseLiteral(ast: ValueNode): Decimal {
		if (ast.kind === Kind.STRING || ast.kind === Kind.INT || ast.kind === Kind.FLOAT) {
			return new Decimal(ast.value.replace(',', '.'))
		}

		throw new Error('Decimal can only parse string, int or float values')
	}
}
