module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module'
  },
  rules: {
    "padded-blocks": ["error", { "blocks": "never" }],
    "space-before-function-paren": ["error", "never"],
    "semi": ["error", "always", { "omitLastInOneLineBlock": true }]
  }
}
