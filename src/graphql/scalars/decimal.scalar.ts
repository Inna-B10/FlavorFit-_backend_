import { CustomScalar, Scalar } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { Kind, ValueNode } from 'graphql'

@Scalar('Decimal', () => Decimal)
export class DecimalScalar implements CustomScalar<string, Decimal> {
	description = 'Decimal custom scalar type'

	parseValue(value: string | number): Decimal {
		// value from client
		if (typeof value === 'string') {
			return new Decimal(value.replace(',', '.'))
		}
		return new Decimal(value)
	}

	serialize(value: Decimal): string {
		// remove trailing zeros, keep exact value
		return value.toFixed()
	}

	parseLiteral(ast: ValueNode): Decimal {
		if (ast.kind === Kind.STRING || ast.kind === Kind.INT || ast.kind === Kind.FLOAT) {
			return new Decimal(ast.value.replace(',', '.'))
		}
		throw new Error('Decimal can only parse string, int or float values')
	}
}
