import Fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import { createBareServer } from '@tomphttp/bare-server-node'
import { baremuxPath } from '@mercuryworkshop/bare-mux/node'

import { fileURLToPath } from 'node:url'
import { createServer } from 'node:http'
import { consola } from 'consola'

const bare = createBareServer('/bare/')
const port = Number(process.env.PORT) || 9000

const app = Fastify({
  serverFactory: (handler) =>
    createServer().on('request', (req, res) => {
      if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res)
      } else {
        handler(req, res)
      }
    })
})

await app
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

app.listen({ port }, () => {
  consola.success(`Server listening on http://localhost:${port}`)
})
