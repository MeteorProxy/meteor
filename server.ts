import fastifyStatic from '@fastify/static'
import { logging, server as wisp } from '@mercuryworkshop/wisp-js/server'
import Fastify from 'fastify'

import { createServer } from 'node:http'
import type { Socket } from 'node:net'
import { argv } from 'node:process'
import { fileURLToPath } from 'node:url'

import { copyFile, mkdir } from 'node:fs/promises'
import { baremuxPath } from '@mercuryworkshop/bare-mux/node'
// @ts-expect-error
import { epoxyPath } from '@mercuryworkshop/epoxy-transport'
import { consola } from 'consola'
import { context } from 'esbuild'
import { rimraf } from 'rimraf'

const port = Number(process.env.PORT) || 9000
logging.set_level(logging.DEBUG)

Fastify({
  serverFactory: (handler) =>
    createServer(handler).on(
      'upgrade',
      (req, socket: Socket, head) =>
        req.url?.endsWith('/wisp/') && wisp.routeRequest(req, socket, head)
    )
})
  .setNotFoundHandler((_req, reply) => {
    reply.code(404).sendFile('404.html', './demo/')
  })
  .register(fastifyStatic, {
    root: fileURLToPath(new URL('./demo', import.meta.url))
  })
  .register(fastifyStatic, {
    root: fileURLToPath(new URL('./dist', import.meta.url)),
    prefix: '/meteor/',
    decorateReply: false
  })
  .register(fastifyStatic, {
    root: baremuxPath,
    prefix: '/baremux/',
    decorateReply: false
  })
  .register(fastifyStatic, {
    root: epoxyPath,
    prefix: '/epoxy/',
    decorateReply: false
  })
  .register(fastifyStatic, {
    root: fileURLToPath(new URL('./assets', import.meta.url)),
    prefix: '/assets/',
    decorateReply: false
  })

  .listen({ port }, () => {
    consola.success(`Server listening on http://localhost:${port}`)
  })
if (!argv.includes('--no-build')) {
  await rimraf('dist')
  await mkdir('dist')
  await copyFile('./src/meteor.config.js', './dist/meteor.config.js')
  const dev = await context({
    sourcemap: true,
    minify: process.env.NODE_ENV !== 'development',
    entryPoints: {
      'meteor.bundle': './src/bundle/index.ts',
      'meteor.client': './src/client/index.ts',
      'meteor.worker': './src/worker.ts',
      'meteor.codecs': './src/codecs/index.ts'
    },
    bundle: true,
    logLevel: 'info',
    outdir: 'dist/'
  })

  await dev.watch()
}
