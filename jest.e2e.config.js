const tsJestPreset = require('ts-jest/jest-preset');
const puppeteerPreset = require('jest-puppeteer/jest-preset');

module.exports = {
  ...tsJestPreset,
  ...puppeteerPreset,
  testEnvironment: 'jest-environment-puppeteer',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': '<rootDir>/node_modules/jest-css-modules',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/unit/'],
  setupFilesAfterEnv: [
    '<rootDir>/setupTests.ts',
    ...puppeteerPreset.setupFilesAfterEnv
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest'
  },
  transformIgnorePatterns: ['/node_modules/'],
  globals: {
    ...tsJestPreset.globals
  },
  testMatch: ["**/e2e/**/*.test.(js|jsx|ts|tsx)"], // Only run tests in the "e2e" folder
};