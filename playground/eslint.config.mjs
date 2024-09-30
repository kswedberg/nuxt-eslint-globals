import projectConfig from '../eslint.config.mjs';
import nuxtGlobals from './.nuxt/.eslint.globals.mjs';
export default {
  ...projectConfig,
  nuxtGlobals,
};
