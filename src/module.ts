/**
 * This module is based on comments in the following GitHub issue:
 * https://github.com/nuxt/eslint-plugin-nuxt/issues/173
 */
import {resolve, relative} from 'path';
import {fileURLToPath} from 'url';
import {addTemplate, defineNuxtModule} from '@nuxt/kit';
import {getUtils} from './utils.mjs';

const modulePath = fileURLToPath(import.meta.url);

// Module options TypeScript interface definition
export interface ModuleOptions {
  custom: string[];
  outputDir: string | null;
  outputType: 'cjs' | 'es' | 'mjs' | 'ts' | 'json';
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'eslint-globals',
    configKey: 'eslintGlobals',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    custom: [],
    outputDir: null,
    outputType: 'cjs',
  },

  setup(options, nuxt) {
    // const resolver = createResolver(import.meta.url);

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    // addPlugin(resolver.resolve('./runtime/plugin'));

    const autoImports = {
      // global imports
      global: [
        '$fetch',
        'useCloneDeep',
        'defineNuxtConfig',
        'definePageMeta',
        // 'defineI18nConfig',
      ],
      // TODO: Figure out a way to programmatically get nitro & h3 imports; remove hard-coded ones
      nitro: ['defineCachedFunction', 'defineCachedEventHandler', 'cachedFunction', 'cachedEventHandler', 'useRuntimeConfig', 'useStorage', 'useNitroApp', 'defineNitroPlugin', 'nitroPlugin', 'defineRenderHandler', 'getRouteRules', 'useAppConfig', 'useEvent'],
      h3: ['appendCorsHeaders', 'appendCorsPreflightHeaders', 'appendHeader', 'appendHeaders', 'appendResponseHeader', 'appendResponseHeaders', 'assertMethod', 'callNodeListener', 'clearResponseHeaders', 'clearSession', 'createApp', 'createAppEventHandler', 'createError', 'createEvent', 'createRouter', 'defaultContentType', 'defineEventHandler', 'defineLazyEventHandler', 'defineNodeListener', 'defineNodeMiddleware', 'defineRequestMiddleware', 'defineResponseMiddleware', 'deleteCookie', 'dynamicEventHandler', 'eventHandler', 'fetchWithEvent', 'fromNodeMiddleware', 'fromPlainHandler', 'fromWebHandler', 'getCookie', 'getHeader', 'getHeaders', 'getMethod', 'getProxyRequestHeaders', 'getQuery', 'getRequestHeader', 'getRequestHeaders', 'getRequestHost', 'getRequestIP', 'getRequestPath', 'getRequestProtocol', 'getRequestURL', 'getRequestWebStream', 'getResponseHeader', 'getResponseHeaders', 'getResponseStatus', 'getResponseStatusText', 'getRouterParam', 'getRouterParams', 'getSession', 'getValidatedQuery', 'handleCacheHeaders', 'handleCors', 'isCorsOriginAllowed', 'isError', 'isEvent', 'isEventHandler', 'isMethod', 'isPreflightRequest', 'isStream', 'isWebResponse', 'lazyEventHandler', 'parseCookies', 'promisifyNodeListener', 'proxyRequest', 'readBody', 'readFormData', 'readMultipartFormData', 'readRawBody', 'readValidatedBody', 'removeResponseHeader', 'sanitizeStatusCode', 'sanitizeStatusMessage', 'sealSession', 'send', 'sendError', 'sendNoContent', 'sendProxy', 'sendRedirect', 'sendStream', 'sendWebResponse', 'serveStatic', 'setCookie', 'setHeader', 'setHeaders', 'setResponseHeader', 'setResponseHeaders', 'setResponseStatus', 'splitCookiesString', 'toEventHandler', 'toNodeListener', 'toPlainHandler', 'toWebHandler', 'toWebRequest', 'unsealSession', 'updateSession', 'useBase', 'useSession', 'writeEarlyHints'],
      custom: [],
      composables: [],
    };


    // Add custom globals from module options
    const config = nuxt.options.runtimeConfig;
    const aieConfig = Object.assign({}, options, config.eslintGlobals);

    if (aieConfig.custom?.length) {
      autoImports.custom = aieConfig.custom;
    }

    const {getName, getPaths, setupContents, processAutoImports} = getUtils(modulePath, aieConfig);

    nuxt.hook('imports:context', async(context) => {
      const imports = await context.getImports();
      const utilsDir = resolve(nuxt.options.serverDir, 'utils');
      const relativeDir = relative(nuxt.options.rootDir, utilsDir);
      const serverUtils = await context.scanImportsFromDir([utilsDir]);
      const serverImports = serverUtils.map((imp) => {
        imp.from = relativeDir;

        return imp;
      });

      imports.push(...serverImports);

      imports.forEach((autoImport) => {
        autoImports[autoImport.from] = autoImports[autoImport.from] || [];
        autoImports[autoImport.from].push(getName(autoImport));
      });
    });

    nuxt.hook('imports:extend', (composableImport) => {
      autoImports.composables = composableImport.map((autoImport) => {
        return getName(autoImport);
      });
    });

    nuxt.hook('modules:done', async() => {
      const imports = processAutoImports(autoImports);

      const paths = await getPaths(nuxt);
      const getContents = setupContents(paths.module, imports);
      const templateOptions = {
        filename: paths.filename,
        getContents,
        write: true,
        dst: paths.dst,
      };

      addTemplate(templateOptions);

      console.log(`\nESLint globals file generated at ${paths.display}\n`);
    });
  },
});
