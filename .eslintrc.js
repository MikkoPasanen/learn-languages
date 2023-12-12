module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: ["react", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "no-var": "error",
    eqeqeq: "error",
    "no-unused-vars": "warn",
    "prefer-const": "error",
    "no-else-return": "error",
    curly: "error",
    "no-multiple-empty-lines": ["error", { max: 1 }],
    camelcase: "error",
    "no-eval": "error",
  },
};
