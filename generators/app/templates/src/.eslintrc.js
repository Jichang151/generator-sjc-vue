module.exports = {
  "root": true,
  "env": {
    "node": true
  },
  "extends": [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript"
  ],
  "parserOptions": {
    "parser": "@typescript-eslint/parser"
  },
  "rules": {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "no-control-regex": 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}