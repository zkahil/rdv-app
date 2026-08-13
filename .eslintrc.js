module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    // Désactiver les règles problématiques
    'react/no-unescaped-entities': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // Règles personnalisées
    'react/prop-types': 'off',
    'react/display-name': 'off',
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'build/',
    '*.config.js',
    '*.config.ts',
    'next-env.d.ts',
  ],
};