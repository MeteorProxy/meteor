// !! Warning !!
// Leave `dom` as the first import
// Things might break intentionally

import './dom'
import './apis/css'
import './apis/location'
import './apis/requests'
import './apis/workers'
import './apis/eventlistener'
import './apis/history'
import './apis/ws'
import './apis/navigator'
import './apis/storage'

declare global {
  interface Window {
    $location: Location
  }
  interface globalThis {
    $location: Location
  }
  interface Document {
    $location: Location
  }
}
// iife needed due to esbuild limitations
;(async () => {
  for (const plugin of await self.$meteor.util.getEnabledPlugins(
    window.$location.href,
    'handleClient'
  )) {
    self.$meteor.util.log(`Running handleClient for ${plugin.name}`, 'teal')
    plugin.handleClient(window)
  }
})()
