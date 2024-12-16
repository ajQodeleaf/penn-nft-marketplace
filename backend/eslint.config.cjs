module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "single"],
      "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
      eqeqeq: "error",
      "no-unused-vars": "warn",
    },
  },
];
