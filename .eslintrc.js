module.exports = {
  root: true,
  env: {
    // this automatically sets the ecmaVersion parser option to 6
    es6: true,
    // browser: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'standard',
    'typescript'
  ],
  plugins: [
    'typescript'
  ],
  rules: {
    /* TypeScript */
    'typescript/member-ordering': 'off',
    'typescript/member-delimiter-style': ['error', {
      requireLast: false,
      delimiter: 'none'
    }],
    'typescript/no-use-before-define': ['error', { functions: false, classes: false }],
    'typescript/no-var-requires': 'off',
    'no-parameter-properties': 'off',
    'typescript/no-non-null-assertion': 'off',

    /* Other */
    // 'max-len': ['error', { 'code': 105 }],
    'no-var': 'error',
    'prefer-arrow-callback': 'error',
    'space-before-function-paren': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 2 }],
    'require-jsdoc': 'off',
    'valid-jsdoc': 'off',

    // 'valid-jsdoc':  ["error", {
    //   requireParamDescription: false,
    //   requireParamType: false,
    //   requireReturn: false,
    //   requireReturnDescription: false,
    //   requireReturnType: false
    // }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'typescript-eslint-parser',
    // parser: 'babel-eslint',
    sourceType: 'module',
    ecmaFeature: {
      jsx: false
    },
    // 9 это 2018
    // ecmaVersion: 9
  }
}
