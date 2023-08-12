const { defaults } = require('jest-config');
const tsJestPreset = require('ts-jest/jest-preset');
const puppeteerPreset = require('jest-puppeteer/jest-preset');

module.exports = {
  ...tsJestPreset,
  ...puppeteerPreset,
  testEnvironment: 'jest-environment-puppeteer',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  moduleNameMapper: {
    // This is required to resolve absolute imports in tests
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': '<rootDir>/node_modules/jest-css-modules',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
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
  }
};
