// !! Warning !!
// Leave `dom` as the first import
// Things might break intentionally

import './dom'
import './apis/location'
import './apis/requests'
import './apis/workers'
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

for (const plugin of self.$meteor.config.plugins) {
  if (plugin.filter.test(window.$location.href)) {
    if ('handleClient' in plugin) {
      self.$meteor.util.log(`Running handleClient for ${plugin.name}`, 'teal')
      plugin.handleClient(window)
    }
  }
}
