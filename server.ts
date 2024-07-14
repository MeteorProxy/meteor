import fastifyStatic from '@fastify/static'
import { server as wisp, logging } from '@mercuryworkshop/wisp-js/server'
import Fastify from 'fastify'

import { createServer } from 'node:http'
import type { Socket } from 'node:net'
import { argv } from 'node:process'
import { fileURLToPath } from 'node:url'

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
  .setNotFoundHandler((req, reply) => {
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

await rimraf('dist')

const dev = await context({
  sourcemap: true,
  minify: process.env.NODE_ENV !== 'development',
  entryPoints: {
    'meteor.bundle': './src/bundle/index.ts',
    'meteor.client': './src/client/index.ts',
    'meteor.worker': './src/worker.ts',
    'meteor.config': './src/config.ts'
  },
  bundle: true,
  logLevel: 'info',
  outdir: 'dist/'
})

if (!argv.includes('--no-build')) {
  await dev.watch()
}
