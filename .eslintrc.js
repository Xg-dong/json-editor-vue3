module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2022: true
    },
    extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'plugin:vue/vue3-recommended',
        'prettier'
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: ['@typescript-eslint', 'vue'],
    rules: {
        // TypeScript 规则
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/ban-types': 'off',

        // Vue 规则
        'vue/multi-word-component-names': 'off',
        'vue/no-unused-vars': 'error',
        'vue/component-definition-name-casing': ['error', 'PascalCase'],
        'vue/component-tags-order': ['error', {
            'order': ['script', 'template', 'style']
        }],

        // 通用规则
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'prefer-const': 'error',
        'no-var': 'error'
    },
    overrides: [
        {
            files: ['**/*.test.ts', '**/*.spec.ts'],
            env: {
                vitest: true
            },
            rules: {
                '@typescript-eslint/no-explicit-any': 'off'
            }
        }
    ],
    ignorePatterns: ['dist/', 'node_modules/', '*.config.js']
}
