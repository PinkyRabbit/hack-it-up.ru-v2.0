module.exports = {
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2017,
  },
  env: {
    node: true,
  },
  rules: {
    "strict": "off",
    "no-console": "off",
    "no-underscore-dangle": "off",
    "comma-dangle": ["error", "always-multiline"],
    "no-multi-spaces": ["error", { "exceptions": { "VariableDeclarator": true } }],
    "no-shadow": ["error", { "allow": ["err"] }],
    "no-use-before-define": ["error", { "functions": false, "classes": true }]
  }
};
