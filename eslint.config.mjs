import js from 'eslint-config-kswedberg/flat/js.mjs';

export default [
  ...js,

  {
    name: 'neg/ignores',
    ignores: [
      'gitignore/*',
      '**/.nuxt/*',
      '**/node_modules/*',
    ],
  },
];
