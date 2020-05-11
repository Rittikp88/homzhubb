module.exports = {
  preset: 'react-native',
  collectCoverage: true,
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '^.+\\.js$': '../../node_modules/react-native/jest/preprocessor.js',
  },
  setupFiles: ['<rootDir>/src/setupTests.js'],
  transformIgnorePatterns: ['node_modules/(?!(jest-)?react-native)'],
  coveragePathIgnorePatterns: ['/node_modules/', '/jest'],
  testPathIgnorePatterns: ['/dist/'], // ignores dist folder while running test cases
  coverageReporters: ['json', 'lcov', 'text'],
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '<rootDir>/src/**/*.tsx',
    '!<rootDir>/src/**/*.mock.ts',
    '!<rootDir>/src/**/*.module.ts',
    '!<rootDir>/src/**/*.spec.ts',
    '!<rootDir>/src/**/*.test.ts',
  ],
  testEnvironment: 'node',
  testResultsProcessor: 'jest-sonar-reporter',
};
