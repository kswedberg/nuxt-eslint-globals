# ESLint Globals

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
<!-- [![License][license-src]][license-href] -->
[![Nuxt][nuxt-src]][nuxt-href]

Nuxt module that creates an eslint globals file for Nuxt auto-imports

All auto-imported functions from Vue, Nuxt, h3, Nitro, and third-party modules will be included. Additionally, exports from your project's `components`, `composables`, and `server/utils` directories will be added.

<!-- - [✨ &nbsp;Release Notes](/CHANGELOG.md) -->
<!-- - [🏀 Online playground](https://stackblitz.com/github/kswedberg/nuxt-eslint-globals?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Quick Setup

1. Add `nuxt-eslint-globals` dependency to your project

```bash
# Using pnpm
pnpm add -D nuxt-eslint-globals

# Using yarn
yarn add --dev nuxt-eslint-globals

# Using npm
npm install --save-dev nuxt-eslint-globals
```

2. Add `nuxt-eslint-globals` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'nuxt-eslint-globals'
  ]
})
```

That's it! The next time you run the `dev` command, the module will create a file named `.eslint.globals.mjs` in your project's build directory (`.nuxt`).

All auto-imported functions from Vue, Nuxt, h3, Nitro, and third-party modules will be included — unless you explicitly exclude them using the `exclude` option. Additionally, exports from your project's `components`, `composables`, and `server/utils` directories will be added.

## Usage

Once the module creates the ESLint globals file, you can reference it in your `eslint.config.*` file:

```js
import nuxtGlobals from '.nuxt/.eslint.globals.mjs';

export default [
  nuxtGlobals,
  // ...other configs
];
```

Or, if you're still using the legacy eslint config type, you can reference the globals in your  `.eslintrc` (See below for setting the `flat` option to `false`):


```json
{
  "extends": [
    ".nuxt/.eslint.globals.mjs"
  ]
}
```

## Options

The module accepts these optional settings:

- **`flat`** (new!): Default is `true`. Whether to use eslint's new flat config.
- **`custom`**: an array of strings representing globals you want to add to the `.eslint.globals.cjs` file in addition to the ones the module adds automatically.
- **`exclude`** (new!): Default is `[]`. Possible values: `['vue', 'nuxt', 'h3', 'nitro', 'composables', 'server-utils']`. An array of strings pertaining to categories of functions. This can be nice if other eslint-config packages are including some of these globals already and you don't want to duplicate efforts. The `composables` and `server-utils` items refer to the project's functions, not Vue or Nuxt globals.
- **`outputType`**: (one of `'cjs'`, `'es'`, `'ts'`, or `'json'`. Default is **`'mjs'`**.) A string representing the type of module you would like to produce. This will affect the file's extension as well as the type of export within the file (of course, `'json'` will just produce the JSON string).
- **`outputDir`**: the directory, relative to the project's root, where you want the `.eslint.globals.cjs` file to be located. If none is provided it will go in the build directory.

You can add options in `nuxt.config` either by using array format for the module registration:

```js
modules: [
  ['nuxt-eslint-globals', {outputType: 'json', flat: false, custom: ['fooo', 'barrrr']}]
]
```

…or adding an `eslintGlobals` property to the config object:

```js
modules: [
  'nuxt-eslint-globals'
],
eslintGlobals: {
  custom: ['fooo', 'barrrr'],
  outputType: 'json',
},
```

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-eslint-globals/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-eslint-globals

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-eslint-globals.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-eslint-globals


[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
