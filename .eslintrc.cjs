module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['@nuxt/eslint-config', 'kswedberg', './playground/.nuxt/.eslint.globals.cjs'],
};
