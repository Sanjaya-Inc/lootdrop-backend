// eslint.config.cjs

const js = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-require-imports': 'warn',
        },
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
            globals: {
                require: 'readonly',
                exports: 'readonly',
                module: 'readonly',
                console: 'readonly',
            },
        },
        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
        },
    },
    {
        ignores: [
            'node_modules',
            'dist',
            '**/eslint.config.js',
            '**/.eslintrc.js',
        ],
    },
];
