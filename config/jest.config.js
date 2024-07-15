module.exports = {
  rootDir: '../',
  testEnvironment: 'node',
  verbose: true,
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    '**/controllers/**/*.js',
    '**/routes/**/*.js'
  ],
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/config/'],
};