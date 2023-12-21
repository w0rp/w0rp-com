module.exports = {
  root: true,
  env: {
    es2020: true,
  },
  // Start with standardjs as a base.
  extends: 'standard',
  parser: '@typescript-eslint/parser',
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
  },
  globals: {
    marked: true,
    Reveal: true,
    hljs: true,
    HighlightCode: true,
    onDocumentReady: true,
  },
  plugins: [
    '@typescript-eslint',
  ],
  ignorePatterns: [
    'public/**/*.js',
    '**/third-party/**/*.js',
    '**/*.min.js',
  ],
  rules: {
    /**
     * Rules that go against StandardJS are here.
     *
     * StandardJS only gets a few things wrong.
     **/

    // Go against StandardJS, and require trailing commas.
    // Trailing commas reduce the size of diffs.
    'comma-dangle': ['warn', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      // Trailing commas for function calls are annoying.
      functions: 'only-multiline',
    }],
    // Don't allow spaces inside braces.
    'object-curly-spacing': ['warn', 'never'],
    // Require NO spaces before the function parentheses.
    'space-before-function-paren': ['warn', 'never'],

    /**
     * Rules that expand on StandardJS are here.
     *
     * These rules enforce even stricter checks.
     */

    // Require line breaks before binary operators.
    // This follow's Knuth's style.
    'operator-linebreak': ['warn', 'before', {
      overrides: {
        '=': 'ignore',
        '+=': 'ignore',
        '-=': 'ignore',
        '*=': 'ignore',
        '/=': 'ignore',
        '%=': 'ignore',
        '**=': 'ignore',
      },
    }],
    'padding-line-between-statements': [
      'warn',
      // Require blank lines before control statements.
      {blankLine: 'always', prev: '*', next: 'block'},
      {blankLine: 'always', prev: '*', next: 'block-like'},
      {blankLine: 'always', prev: '*', next: 'break'},
      {blankLine: 'always', prev: '*', next: 'class'},
      {blankLine: 'always', prev: '*', next: 'continue'},
      {blankLine: 'always', prev: '*', next: 'do'},
      {blankLine: 'always', prev: '*', next: 'for'},
      {blankLine: 'always', prev: '*', next: 'if'},
      {blankLine: 'always', prev: '*', next: 'return'},
      {blankLine: 'always', prev: '*', next: 'switch'},
      {blankLine: 'always', prev: '*', next: 'throw'},
      {blankLine: 'always', prev: '*', next: 'try'},
      {blankLine: 'always', prev: '*', next: 'while'},
      // Do not allow blank lines before switch statement labels.
      {blankLine: 'never', prev: '*', next: 'case'},
      {blankLine: 'never', prev: '*', next: 'default'},
    ],
    // Prefer arrow functions.
    'prefer-arrow-callback': 'warn',
    // Complain about braces for arrow functions when they are not needed.
    'arrow-body-style': ['warn', 'as-needed'],
    // Require parentheses to make arrow function bodies less confusing.
    'no-confusing-arrow': ['error', {allowParens: true}],
    // Require const or let instead of var.
    'no-var': 'error',
    // Prefer const over let.
    'prefer-const': 'error',
    // Prefer expressions for functions.
    'func-style': 'error',
  },
}
