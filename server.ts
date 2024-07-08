import fastifyStatic from '@fastify/static'
import { baremuxPath } from '@mercuryworkshop/bare-mux/node'
import Fastify from 'fastify'
import wisp from 'wisp-server-node'
import fs from 'node:fs'

import { createServer } from 'node:http'
import type { Socket } from 'node:net'
import { fileURLToPath } from 'node:url'
import { consola } from 'consola'
import { resolve } from 'node:path'
import { context } from 'esbuild'

const port = Number(process.env.PORT) || 9000

Fastify({
  serverFactory: (handler) =>
    createServer(handler).on(
      'upgrade',
      (req, socket: Socket, head) =>
        req.url?.endsWith('/wisp/') && wisp.routeRequest(req, socket, head)
    )
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
    prefix: '/bare-mux/',
    decorateReply: false
  })

  .listen({ port }, () => {
    consola.success(`Server listening on http://localhost:${port}`)
  })

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

await dev.watch()
