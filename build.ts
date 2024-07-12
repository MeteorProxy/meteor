import { copyFile, mkdir } from 'node:fs/promises'
import { build } from 'esbuild'
import { rimraf } from 'rimraf'

await rimraf('dist')
await mkdir('dist')
// await copyFile('src/meteor.config.js', 'dist/meteor.config.js')
await build({
  sourcemap: true,
  minify: process.env.NODE_ENV !== 'development',
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
