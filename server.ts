import fastifyStatic from '@fastify/static'
// @ts-expect-error not typed lol
import { epoxyPath } from '@mercuryworkshop/epoxy-transport'
import Fastify from 'fastify'
import wisp from 'wisp-server-node'

import { createServer } from 'node:http'
import type { Socket } from 'node:net'
import { fileURLToPath } from 'node:url'
import { consola } from 'consola'
import { context } from 'esbuild'
import copy from 'esbuild-plugin-copy'
import { argv } from 'node:process'

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

const dev = await context({
  sourcemap: true,
  minify: process.env.NODE_ENV !== 'development',
  entryPoints: {
    'meteor.bundle': './src/bundle/index.ts',
    'meteor.client': './src/client/index.ts',
    'meteor.worker': './src/worker.ts',
    'meteor.config': './src/config.ts'
  },
  plugins: [
    copy({
      resolveFrom: 'cwd',
      assets: [
        {
          from: ['./node_modules/@mercuryworkshop/bare-mux/dist/bare.cjs'],
          to: ['./demo/bare-mux.js']
        }
      ]
    })
  ],
  bundle: true,
  logLevel: 'info',
  outdir: 'dist/'
})

if (!argv.includes('--no-build')) {
  await dev.watch()
}
