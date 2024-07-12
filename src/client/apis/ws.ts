import BareClient from '@mercuryworkshop/bare-mux'
const client = new BareClient()
const RealWebSocket = globalThis.WebSocket;
globalThis.WebSocket = new Proxy(globalThis.WebSocket, {
  construct(_target, args) {
    return client.createWebSocket(
      args[0],
      args[1],
      RealWebSocket,
      {
        'User-Agent': navigator.userAgent
      },
      ArrayBuffer
    )
  }
})
