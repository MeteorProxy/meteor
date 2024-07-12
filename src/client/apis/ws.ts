// boken, "there are no bare clients"
import BareClient from '@mercuryworkshop/bare-mux'
globalThis.WebSocket = new Proxy(globalThis.WebSocket, {
  construct(_target, args) {
    return new BareClient().createWebSocket(
      args[0],
      args[1],
      WebSocket,
      {
        'User-Agent': navigator.userAgent
      },
      ArrayBuffer
    )
  }
})
