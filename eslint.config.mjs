import cheminfo from 'eslint-config-cheminfo';

export default [
  ...cheminfo,
  {
    languageOptions: {
      globals: {
        __dirname: false,
      },
    },
    rules: {
      camelcase: 'off',
    },
  },
];
