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

That's it! The next time you run the `dev` command, the module will create a file named `.eslint.globals.cjs` in your project's build directory (`.nuxt`).

All auto-imported functions from Vue, Nuxt, h3, Nitro, and third-party modules will be included. Additionally, exports from your project's `components`, `composables`, and `server/utils` directories will be added.

## Usage

Once the module creates the `.eslint.globals.cjs` file, you can reference it in your `.eslintrc` file:

```json
{
  "extends": [
    ".nuxt/.eslint.globals.cjs"
  ]
}

```

## Options

The module accepts two options:

- `custom`: an array of strings representing globals you want to add to the `.eslint.globals.cjs` file in addition to the ones the module adds automatically
- `outputDir`: a directory, relative to the project's root, where you want the `.eslint.globals.cjs` file to be located. If none is provided it will go in the build directory.

You can add options in `nuxt.config` either by using array format for the module registration:

```js
modules: [
  ['nuxt-eslint-globals', {custom: ['fooo', 'barrrr']}]
]
```

…or adding an `eslintGlobals` property to the config object:

```js
modules: [
  'nuxt-eslint-globals'
],
eslintGlobals: {
  custom: ['fooo', 'barrrr'],
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
