/** @type {import('ts-jest').JestConfigWithTsJest} */
/* eslint-disable */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.ts'],
};