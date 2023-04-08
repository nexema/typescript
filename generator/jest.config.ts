export default {
    collectCoverage: true,
    collectCoverageFrom: [
        './src/**/*.ts',
        '!./src/**/*.interface.ts',
        '!./src/**/*.mock.ts',
        '!./src/**/*.module.ts',
        '!./src/**/*.spec.ts',
        '!./src/**/*.test.ts',
        '!./src/**/*.d.ts',
        '!./src/index.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['lcov', 'text-summary', 'html'],
    moduleFileExtensions: ['ts', 'js', 'tsx'],
    preset: 'ts-jest',
    testMatch: ['**/*.test.ts'],
    testEnvironment: 'node',
}
