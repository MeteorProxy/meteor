import type { Plugin } from '@/types'

export default {
  name: 'exampleplugin',
  inject(ctx) {
    ctx.injectHead(`<meta name="meteor" content="meteor - epic proccy">`)
  },
  async onRequest(request) {
    request.headers.set('X-Proxy', 'Meteor')
    return request
  }
} satisfies Plugin
