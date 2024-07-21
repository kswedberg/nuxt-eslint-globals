import {describe, it, expect, afterAll} from 'vitest';
import {fileURLToPath} from 'node:url';
import {setup} from '@nuxt/test-utils';
import {readFileSync, rmSync} from 'node:fs';
import {join} from 'node:path';

describe('globals', async() => {
  const rootDir = fileURLToPath(new URL('./fixtures/legacy', import.meta.url));
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
});
