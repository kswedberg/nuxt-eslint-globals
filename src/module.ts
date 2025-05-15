/**
 * This module is based on comments in the following GitHub issue:
 * https://github.com/nuxt/eslint-plugin-nuxt/issues/173
 */
import {fileURLToPath} from 'url';
import {addTemplate, defineNuxtModule, useLogger} from '@nuxt/kit';
import {getUtils} from './utils.mjs';
import {resolveModuleExportNames} from 'mlly';

const logger = useLogger("nuxt:esLint-globals");

const modulePath = fileURLToPath(import.meta.url);

// Module options TypeScript interface definition
export interface ModuleOptions {
  custom: string[];
  exclude: string[];
  flat: boolean;
  outputDir: string | null;
  outputType: 'cjs' | 'es' | 'mjs' | 'ts' | 'json';
  debug: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'eslint-globals',
    configKey: 'eslintGlobals',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    custom: [],
    exclude: [],
    flat: true,
    outputDir: null,
    outputType: 'mjs',
    debug: false,
  },

  setup(options, nuxt) {

    const autoImports = {
      // global imports
      global: [
        '$fetch',
        'defineNuxtConfig',
        'definePageMeta',
        // 'defineI18nConfig',
      ],
      h3: [],
      nitro: [],
      custom: [],
      composables: [],
    };

    // Add custom globals from module options
    const config = nuxt.options.runtimeConfig;
    const aieConfig = Object.assign({}, options, config.eslintGlobals);

    if (aieConfig.custom?.length) {
      autoImports.custom = aieConfig.custom;
    }

    const {getName, getPaths, setupContents, getNitroImports, getServerImports} = getUtils(modulePath, aieConfig);
    const excludes = aieConfig.exclude;
    const excludeComposablesIndex = excludes.indexOf('composables');

    // Need to remove 'composables' from excludes array,
    // because it could trigger a false positive for something like '#app/composables/…
    if (excludeComposablesIndex > -1) {
      try {
        excludes.splice(excludeComposablesIndex, 1);
      } catch (error) {
        console.log('typeof excludes??', typeof excludes);
      }

    }

    nuxt.hook('imports:context', async(context) => {
      // Get all exposed auto-imports
      const imports = await context.getImports();

      // Also, need to get server-side auto-imports:
      // h3 & nitro, as well as custom imports from server/utils
      const h3 = excludes.includes('h3') ? [] : await resolveModuleExportNames('h3');
      const nitro = excludes.includes('nitro') ? [] : await getNitroImports();

      if (!excludes.includes('server-utils')) {
        const serverImports = await getServerImports(nuxt, context);

        imports.push(...serverImports);
      }

      for (const autoImport of imports) {
        const from = autoImport.from;
        const exclude = excludes.some((ex) => from.includes(ex));

        if (!exclude) {
          autoImports[from] = autoImports[from] || [];
          autoImports[from].push(getName(autoImport));
        }
      }

      Object.assign(autoImports, {
        h3: h3.filter((name) => !/^[A-Z]/.test(name)),
        nitro: nitro.filter((name) => name !== 'opts'),
      });
    });

    nuxt.hook('imports:extend', (composableImport) => {
      if (excludeComposablesIndex === -1) {
        autoImports.composables = composableImport.map((autoImport) => {
          return getName(autoImport);
        });
      }
    });

    nuxt.hook('modules:done', async() => {
      const paths = await getPaths(nuxt);
      const getContents = setupContents(paths.module, autoImports);
      const templateOptions = {
        filename: paths.filename,
        getContents,
        write: true,
        dst: paths.dst,
      };

      addTemplate(templateOptions);

      logger.success(`ESLint globals file generated at ${paths.display}`);
    });
  },
});
