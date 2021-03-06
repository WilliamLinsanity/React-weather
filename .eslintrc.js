module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "no-console": "off",
    "no-param-reassign": 0,
    semi: 0,
    radix: ["error", "as-needed"],
    indent: ["error", 2],
    "react/prop-types": 0,
    "react-in-jsx-scope": "off",
    "no-unused-vars": "off",
  },
};
