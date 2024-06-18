// @ts-nocheck
import { build } from "esbuild"
import { rimraf } from "rimraf"
import { copyFile, mkdir, readFile } from 'node:fs/promises';
const isDevelopment = process.argv.includes('--dev');
await rimraf('dist');
await mkdir('dist');
await build({
    platform: 'browser',
    sourcemap: true,
    minify: !isDevelopment,
    entryPoints: {
        'bundle': './src/client/index.ts',
        'config': './src/config.ts'
    },
    bundle: true,
    logLevel: 'info',
    outdir: 'dist/',
});