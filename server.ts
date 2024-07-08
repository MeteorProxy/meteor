import fastifyStatic from '@fastify/static'
import { baremuxPath } from '@mercuryworkshop/bare-mux/node'
import Fastify from 'fastify'
import wisp from 'wisp-server-node'

import { createServer } from 'node:http'
import type { Socket } from 'node:net'
import { fileURLToPath } from 'node:url'
import { consola } from 'consola'

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
