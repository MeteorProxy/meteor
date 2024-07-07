// @ts-nocheck
import { build } from "esbuild"
import { rimraf } from "rimraf";

await rimraf("dist")

await build({
    platform: 'browser',
    sourcemap: true,
    minify: true,
    entryPoints: {
        'bundle': './src/bundle/index.ts',
        'client': './src/client/index.ts',
        'worker': './src/worker.ts',
    },
    bundle: true,
    logLevel: 'info',
    outdir: 'dist/',
});

await build({
    platform: 'browser',
    sourcemap: false,
    minify: false,
    entryPoints: {
        'config': './src/config.ts'
    },
    bundle: true,
    logLevel: 'info',
    outdir: 'dist/',
});