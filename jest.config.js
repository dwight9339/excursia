module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // This is required to resolve absolute imports in tests
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
};
