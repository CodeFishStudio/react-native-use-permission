module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: [
        '@react-native-community',
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        allowImportExportEverywhere: true,
    },
    plugins: ['react', 'react-native', 'prettier', '@typescript-eslint'],
    rules: {},
};
