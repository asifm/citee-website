module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
  },
  env: {
    browser: true,
    node: true,
  },
  extends: ['airbnb-base', 'plugin:promise/recommended', 'plugin:vue/recommended'],
  // required to lint *.vue files
  plugins: ['html', 'promise', 'vue'],
  // add your custom rules here
  rules: {
    'no-console': 0,
    'no-param-reassign': ['error', { props: false }],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
  },
  globals: {},
};
