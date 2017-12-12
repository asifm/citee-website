module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
  },
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:promise/recommended',
    'plugin:vue/recommended',
  ],
  // html required to lint *.vue files
  plugins: ['html', 'promise', 'vue'],
  // add  custom rules here
  rules: {
    'max-len': ['warn', { code: 80 }],
    'no-console': 0,
    'no-return-assign': 0,
    'no-param-reassign': ['error', { props: false }],
    'import/prefer-default-export': 0,
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
  },
  globals: {},
};
