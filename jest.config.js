/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/',
  ],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/styleMock.js",
    '\\.(css|scss)$': '<rootDir>/styleMock.js',
  },
  setupFilesAfterEnv: [
    '<rootDir>/setupTests.js',
  ],
  verbose: true,
  coverageDirectory: '<rootDir>/reports',
  coverageReporters: [
    "json",
    "lcov",
    "text",
    "text-summary"
  ]
};
