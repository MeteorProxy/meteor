// @ts-nocheck
import { build } from 'esbuild'
import { rimraf } from 'rimraf'

await rimraf('dist')

await build({
  sourcemap: true,
  minify: true,
  entryPoints: {
    'meteor.bundle': './src/bundle/index.ts',
    'meteor.client': './src/client/index.ts',
    'meteor.worker': './src/worker.ts'
  },
  bundle: true,
  logLevel: 'info',
  outdir: 'dist/'
})

await build({
  sourcemap: false,
  minify: false,
  entryPoints: {
    'meteor.config': './src/config.ts'
  },
  bundle: true,
  logLevel: 'info',
  outdir: 'dist/'
})
