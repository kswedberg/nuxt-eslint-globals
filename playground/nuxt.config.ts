export default defineNuxtConfig({
  srcDir: 'src/',
  modules: [
    // '../src/module',
    ['../src/module', {outputType: 'cjs', flat: false}],
    // ['../src/module', {exclude: ['h3', 'nitro', '#app', 'vue']}],
  ],
  devtools: {enabled: true},
});
