import type { Plugin } from '@/types'

export default {
  name: 'exampleplugin',
  inject(ctx) {
    ctx.injectHead(`<meta name="foo" content="bar">`)
  }
} satisfies Plugin
