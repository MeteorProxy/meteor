import type { Plugin } from '@/types'

export default {
  name: 'exampleplugin',
  filter: /https:\/\/example.com*/g,
  inject(ctx) {
    ctx.injectHead(`<meta name="meteor" content="meteor - epic proccy">`)
  },
  async onRequest(request) {
    request.headers.set('X-Proxy', 'Meteor')
    return request
  },
  handleClient(window) {
    window.console.log('Meteor is running on the client!')
    const ws = new WebSocket('wss://echo.websocket.org/')
    ws.addEventListener('message', (e) => {
      console.log(e.data)
    })
  }
} satisfies Plugin
