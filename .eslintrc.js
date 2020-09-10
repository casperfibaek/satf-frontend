module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        Office: true,
        OfficeExtension: true,
        Excel: true,
        L: true,
        idbKeyval: true,
        CustomFunctions: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        'no-console': 0,
        camelcase: 0,
        'no-underscore-dangle': 0,
        'max-len': 0,
        indent: ['error', 4],
        'linebreak-style': 0,
    },

};
