import BareClient from '@mercuryworkshop/bare-mux'
const client = new BareClient()
const RealWebSocket = globalThis.WebSocket

globalThis.WebSocket = new Proxy(globalThis.WebSocket, {
  construct(_target, args) {
    self.$meteor.util.log(
      `Creating websocket to ${args[0]} on origin ${self.$meteor.util.createOrigin().origin}`
    )
    return client.createWebSocket(
      args[0],
      args[1],
      RealWebSocket,
      {
        'User-Agent': navigator.userAgent,
        origin: self.$meteor.util.createOrigin().origin
      },
      ArrayBuffer.prototype
    )
  }
})
