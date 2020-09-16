module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2015: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'linebreak-style': 0,
    'no-console': 0,
    'no-restricted-globals': 0,
    'no-underscore-dangle': 0,
    'max-len': ['error', { code: 120 }],
    'import/extensions': 0,
    camelcase: 0,
  },
  globals: {
    Office: 'readonly',
    Excel: 'readonly',
    CustomFunctions: 'readonly',
    OfficeExtension: 'readonly',
    L: 'readonly', // Leaflet,
    mapboxgl: 'readonly', // mapbox
    FluentUIReact: 'readonly',
    ReactDOM: 'readonly',
    React: 'readonly',
  },
};
