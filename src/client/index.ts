import './apis/requests'
import './apis/storage'
import './apis/location'
import './dom'

declare global {
  interface Window {
    $location: Location
  }
}

for (const plugin of self.Meteor.config.plugins) {
  plugin.handleClient(window)
}
