module.exports = {
  env: {
    browser: true,
    es2015: true,
  },
  extends: [
    'airbnb-base',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'no-continue': 0,
    'linebreak-style': 0,
    'no-console': 0,
    'import/extensions': 0,
    'max-len': 0,
    'import/no-unresolved': 'error',
    'no-underscore-dangle': 0,
    'jsx/uses-factory': [1, { pragma: 'JSX' }],
    'jsx/factory-in-scope': [0, { pragma: 'JSX' }],
    'jsx/mark-used-vars': 1,
    'jsx/no-undef': 0,
  },
  globals: {
    Office: 'readonly',
    Excel: 'readonly',
    CustomFunctions: 'readonly',
    OfficeExtension: 'readonly',
    L: 'readonly', // Leaflet,
    mapboxgl: 'readonly',
    FluentUIReact: 'readonly',
    ReactDOM: 'readonly',
    React: 'readonly',
    OfficeRuntime: 'readonly',
    globalThis: 'writable',
  },
  plugins: ['import', 'jsx'],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
