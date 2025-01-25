import globals from 'globals';
import js from '@eslint/js';

export default [
    {
        ignores: ['**/dist/**', '**/template/**'],
    },
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.commonjs,
                ...globals.node,
            },
        },
    },
];
