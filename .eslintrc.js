module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true,
        node: true,
    },
    extends: [
        'airbnb-base',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:vue/essential',
    ],

    // html required to lint *.vue files?
    plugins: [ 'vue', 'import' ],

    // add  custom rules here
    rules: {
        // disable airbnb/plugin defaults
        'no-multi-str': 0,
        'no-console': 0,
        'no-return-assign': 0,
        'import/prefer-default-export': 0,
        'no-use-before-define': [ 'error', { functions: false } ],

        // indentation
        indent: [ 'error', 4,
            // {"FunctionDeclaration": {"parameters": "first"},
            // "FunctionExpression": {"parameters": "first"},
            // "CallExpression": {"arguments": "first"}},
        ],

        // string
        quotes: [ 'error', 'single' ],
        
        // prettier tries to fit max possible in a line; so shorter max-len preferred
        'max-len': [
            'warn',
            {
                code: 80,
                ignoreComments: true,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreUrls: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
                // ignores if v- and smoe html tags at start
                ignorePattern: '^\\s*(v-|div(\\(|\.|\\s)|p(\\(|\.|\\s)|h2(\\(|\.|\\s))',
            },
        ],

        // function
        complexity: [ 'warn', 5 ],
        'no-param-reassign': [ 'error', { props: false } ],
        'max-depth': [ 'error', 4 ],
        'max-nested-callbacks': [ 'error', 3 ],
        'max-params': [ 'error', 5 ],
        'function-paren-newline': [ 'warn', 'consistent' ],
        'arrow-parens': [ 'error', 'as-needed' ],
        // spacing
        'space-in-parens': [ 'error', 'always' ],
        'template-curly-spacing': [ 'error', 'always' ],
        'array-bracket-spacing': [ 'error', 'always' ],
        'object-curly-spacing': [ 'error', 'always' ],
        'computed-property-spacing': [ 'error', 'always' ],
        'no-multiple-empty-lines': [ 'error', { max: 1, maxEOF: 0, maxBOF: 0 } ],
        'array-element-newline': ['warn', { 'minItems': 3, }],
        'array-element-newline': ['warn', { 'minItems': 3, }],
        'object-property-newline': ['warn'],
        // comma dangle
        'comma-dangle': [
            'warn',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'only-multiline',
            },
        ],
    },
};
