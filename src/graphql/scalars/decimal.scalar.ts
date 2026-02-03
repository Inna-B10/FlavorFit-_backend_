import { CustomScalar, Scalar } from '@nestjs/graphql'
import Decimal from 'decimal.js'
import { Kind, ValueNode } from 'graphql'

@Scalar('Decimal', () => Decimal)
export class DecimalScalar implements CustomScalar<string, Decimal> {
	description = 'Decimal custom scalar type'

	parseValue(value: string | number): Decimal {
		// value from client
		return new Decimal(value)
	}

	serialize(value: Decimal): string {
		// value sent to client
		return value.toString()
	}

	parseLiteral(ast: ValueNode): Decimal {
		if (ast.kind === Kind.STRING || ast.kind === Kind.INT || ast.kind === Kind.FLOAT) {
			return new Decimal(ast.value)
		}
		throw new Error('Decimal can only parse string, int or float values')
	}
}
