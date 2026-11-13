/** @type {import('jest').Config} */
module.exports = {
	moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
	rootDir: '.',
	testEnvironment: 'node',
	testRegex: '.*\\.spec\\.ts$',
	roots: ['<rootDir>/src', '<rootDir>/tests/unit'],
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest'
	},
	moduleNameMapper: {
		'^src/(.*)$': '<rootDir>/src/$1',
		'^(\\.{1,2}/.*)\\.js$': '$1'
	}
}
