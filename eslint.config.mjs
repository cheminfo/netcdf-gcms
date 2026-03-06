import cheminfo from 'eslint-config-cheminfo-typescript';

export default [
  ...cheminfo,
  {
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      camelcase: 'off',
    },
  },
];
