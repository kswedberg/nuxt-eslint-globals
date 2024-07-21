import eslintGlobals from '../../../src/module';
import {defineNuxtConfig} from 'nuxt/config';

export default defineNuxtConfig({
  modules: [
    [eslintGlobals, {outputDir: 'gitignore', exclude: ['vue']}],
  ],
});
