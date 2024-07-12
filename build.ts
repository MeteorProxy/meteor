import { mkdir, writeFile } from 'node:fs/promises'
import { build } from 'esbuild'
import { rimraf } from 'rimraf'

await rimraf('dist')
await mkdir('dist')
// await copyFile('src/meteor.config.js', 'dist/meteor.config.js')
const buildResult = await build({
  sourcemap: true,
  minify: process.env.NODE_ENV !== 'development',
  entryPoints: {
    'meteor.bundle': './src/bundle/index.ts',
    'meteor.client': './src/client/index.ts',
    'meteor.worker': './src/worker.ts'
  },
  bundle: true,
  logLevel: 'info',
  outdir: 'dist/',
  metafile: true
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

if (buildResult.metafile)
  writeFile('./dist/metafile.json', JSON.stringify(buildResult.metafile))
