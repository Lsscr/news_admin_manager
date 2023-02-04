module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  rules: {
    "vue/multi-word-component-names": "off",
    "vue/return-in-computed-property": "off",
    "vue/require-prop-type-constructor": "off",
    "no-case-declarations": "off",
    "no-useless-escape": "off",
    "no-irregular-whitespace": "off",
    "no-unused-vars": "off",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
  parserOptions: {
    parser: "babel-eslint",
  },
};
