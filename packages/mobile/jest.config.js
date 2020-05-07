module.exports = {
  "preset": "react-native",
  "collectCoverage": true,
  "moduleDirectories": [
    "node_modules",
    "src"
  ],
  "transform": {
    "^.+\\.js$": "../../node_modules/react-native/jest/preprocessor.js"
  },
  "setupFiles": [
    "<rootDir>/src/setupTests.js"
  ],
  "transformIgnorePatterns": [
    "node_modules/(?!(jest-)?react-native)"
  ],
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/jest"
  ]
}