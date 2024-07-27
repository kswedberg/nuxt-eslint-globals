// @ts-check

import {basename, resolve, relative} from 'path';
import {resolvePath} from '@nuxt/kit';

/**
 *
 * @param {string} modulePath
 * @param {import('./module').ModuleOptions} options The merged options object for the module, a combination of defaults and user-defined options.
 * @return {object} functions An object containing the functions getName, getPaths and setupContents.
 *
 */
export const getUtils = (modulePath, options) => {
  const isJson = options.outputType === 'json';
  const appDir = '/app/';

  const getModulePath = async() => {
    const mfPath = await resolvePath(modulePath);

    return mfPath.replace(appDir, '');
  };

  /**
   * @function getJsonString
   * @param {string} imports JSON string representing the imports
   * @returns {function} Function that returns a JSON string representing the top-level config for globals
   */
  const getJsonString = (imports) => {
    const globals = JSON.parse(`{${imports}}`);
    const output = {
      globals,
    };

    return () => JSON.stringify(output, null, 2);
  };

  /**
   * @function processAutoImports
   * @param {Object} autoImports
   * @returns {string}
   */
  const processAutoImports = (autoImports) => {
    const setList = new Set();
    const spaces = options.flat ? 8 : 6;
    const space = ' '.repeat(spaces);
    const imports = Object.entries(autoImports)
    .map(([key, importGroup]) => {
      if (!importGroup?.length) {
        return null;
      }

      const imps = importGroup
      .map((/** @type {string} */ imp) => {
        if (setList.has(imp)) {
          return null;
        }
        setList.add(imp);

        return isJson ? `"${imp}": "readonly"` : `${space}${imp}: 'readonly'`;
      })
      .filter(Boolean)
      .join(',\n');

      return isJson ? imps : `${space}// ${key}\n${imps}`;
    })
    .filter(Boolean)
    .join(',\n');

    setList.clear();

    return imports;
  };

  /**
   *
   * @param {import('unimport').Import} autoImp An autoImport as retrieved from Nuxt's context.getImports() function
   * @return {string} The name of the autoImport, as defined in either the 'as' property or the 'name' property of the autoImport.
   */
  const getName = (autoImp) => {
    return autoImp.as ? autoImp.as.toString() : autoImp.name.toString();
  };

  /**
   * @function getServerImports
   * @param {*} nuxt
   * @param {*} context
   */
  const getServerImports = async(nuxt, context) => {
    const utilsDir = resolve(nuxt.options.serverDir, 'utils');
    const relativeDir = relative(nuxt.options.rootDir, utilsDir);
    const serverUtils = await context.scanImportsFromDir([utilsDir]);
    const serverImports = serverUtils.map((/** @type {any} */ imp) => {
      return Object.assign(imp, {from: relativeDir});
    });

    if (options.debug) {
      console.log('utilsDir', utilsDir);
      console.log('relativeDir', relativeDir);
      console.log('serverImports', serverImports);
    }

    return serverImports;
  };

  /**
   * @typedef Paths
   * @property {string} module The path of the module file
   * @property {string} output The path of the output directory
   * @property {string} full The full path of the file to be created
   * @property {string} display The path of the file to be created, with the app directory removed
   * @property {string} filename The name of the file to be created
   * @property {string} [dst] The optional explicit full path of the file to be created, used only if the outputDir option is provided
   */

  /**
   * @function getPaths
   * @desc Returns an object of paths to be used in the module
   * @param {import('@nuxt/schema').Nuxt} nuxt The Nuxt object passed to the module
   * @return {Promise<Paths>} A Promise containing an object of paths to be used in the module
   */
  const getPaths = async(nuxt) => {
    const ext = options.outputType === 'es' ? 'mjs' : options.outputType;
    const filename = `.eslint.globals.${ext}`;
    const module = await getModulePath();
    const output = basename(nuxt.options.buildDir);
    const full = resolve(output, filename);
    const display = full.replace(appDir, '');

    /**
     * @type {Paths}
     */
    const paths = {module, output, full, display, filename};

    if (options.outputDir) {
      paths.dst = resolve(nuxt.options.rootDir, options.outputDir, filename);
      paths.display = paths.dst;
    }

    return paths;
  };

  /**
   * Returns a function that returns the contents of the file
   * @param {string} modulePath The path of the module file
   * @param {string} autoImports A string representing a set of key value pairs to be inserted into a file as the body of the globals object
   * @return {function} The function to be set as the getContents property of the options arg, passed to the `addTemplate` function
   */
  const setupContents = (modulePath, autoImports) => {
    const imports = processAutoImports(autoImports);

    if (isJson) {
      return getJsonString(imports);
    }

    const line1 = options.outputType === 'cjs' ? 'module.exports = {' : 'export default {';
    const comment = `/*
  This file is auto-generated by ${modulePath}
*/`;

    // Flat config:
    if (options.flat) {
      return () => {
        const c = `${comment}
  ${line1}
    name: 'kswedberg/nuxt-globals',
    languageOptions: {
      globals: {
${imports},
      },
    },
  };
`;

        return c;
      };
    }

    // Legacy config:
    return () => {
      const c = `${comment}
  ${line1}
    globals: {
      ${imports},
    },
  };
`;

      return c;
    };
  };

  return {
    getName,
    getPaths,
    setupContents,
    getServerImports,
  };
};
