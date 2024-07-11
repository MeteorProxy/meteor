// DO NOT MODIFY THE ORDER OF THESE IMPORTS UNLESS YOU KNOW WHAT YOU'RE DOING!!!111import './dom'
import './dom'
import './apis/location'
import './apis/requests'
import './apis/storage'

declare global {
  interface Window {
    $location: Location
  }
}

for (const plugin of self.$meteor.config.plugins) {
  if ('handleClient' in plugin) plugin.handleClient(window)
}
