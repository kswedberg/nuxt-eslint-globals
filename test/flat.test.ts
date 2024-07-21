import {describe, it, expect, afterAll} from 'vitest';
import {fileURLToPath} from 'node:url';
import {setup} from '@nuxt/test-utils';
import {readFileSync, rmSync} from 'node:fs';
import {join} from 'node:path';

describe('globals', async() => {
  const rootDir = fileURLToPath(new URL('./fixtures/flat', import.meta.url));
  const outputDir = join(rootDir, 'gitignore');
  const outputFile = join(outputDir, '.eslint.globals.mjs');


  await setup({
    rootDir,
  });

  afterAll(() => {
    rmSync(outputDir, {force: true, recursive: true});
  });


  it('outputs eslint globals file', () => {
    const text = readFileSync(outputFile, 'utf-8');

    expect(text).toContain('name: \'kswedberg/nuxt-globals\'');
    expect(text).toContain('languageOptions:');
    expect(text).toContain('globals:');
  });

  it('adds default globals', () => {
    const text = readFileSync(outputFile, 'utf-8');

    expect(text).toContain('definePageMeta:');
  });

  it('adds globals from composables directory', () => {
    const text = readFileSync(outputFile, 'utf-8');

    expect(text).toContain('useTestMe:');
  });

  it('adds globals from server utils directory', () => {
    const text = readFileSync(outputFile, 'utf-8');

    expect(text).toContain('testServerUtil:');
  });

  it('adds Nitro and H3 globals', () => {
    const text = readFileSync(outputFile, 'utf-8');
    const someNitroH3Globals = ['useNitroApp', 'useStorage', 'appendCorsHeaders', 'appendCorsPreflightHeaders', 'appendHeader', 'appendResponseHeaders', 'callNodeListener', 'clearResponseHeaders', 'clearSession', 'createApp', 'createAppEventHandler', 'createEvent', 'createEventStream', 'defineEventHandler', 'defineLazyEventHandler', 'defineNodeListener', 'defineNodeMiddleware', 'defineResponseMiddleware', 'defineWebSocket', 'dynamicEventHandler', 'eventHandler', 'fetchWithEvent', 'getCookie', 'getHeader', 'getHeaders', 'getMethod'];

    for (const item of someNitroH3Globals) {
      expect(text).toContain(` ${item}: 'readonly'`);
    }
  });
  it('adds Nuxt globals', () => {
    const text = readFileSync(outputFile, 'utf-8');
    const someNuxtGlobals = ['useNuxtApp', 'defineNuxtPlugin', 'defineNuxtComponent', 'useAsyncData', 'useLazyAsyncData', 'useNuxtData', 'refreshNuxtData', 'useHydration', 'useState', 'clearError', 'showError', 'useError', 'useFetch', 'useLazyFetch', 'useCookie', 'refreshCookie', 'abortNavigation', 'defineNuxtRouteMiddleware', 'navigateTo', 'useRoute', 'useRouter', 'onBeforeRouteLeave', 'onBeforeRouteUpdate'];

    for (const item of someNuxtGlobals) {
      expect(text).toContain(` ${item}: 'readonly'`);
    }
  });

  it('skips the vue globals', () => {
    const text = readFileSync(outputFile, 'utf-8');
    const someVueGlobals = ['onUnmounted', 'onUpdated', 'computed', 'markRaw', 'reactive', 'ref', 'shallowRef', 'toRaw', 'toRef', 'toRefs', 'unref', 'watch'];

    for (const item of someVueGlobals) {
      expect(text).not.toContain(` ${item}:`);
    }
  });
});
