import nextJest from "next/jest";
const createJestConfig = nextJest({
  dir: "./"
});
const customJestConfig = {
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom"
};
module.exports = createJestConfig(customJestConfig);

/*
module.exports = {
  testEnvironment: 'node',
  verbose: true,
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  transformIgnorePatterns: ["node_modules/?!(@jest)"]
};
*/