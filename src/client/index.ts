import './apis/requests'
import './apis/storage'
import './apis/location'
import './dom'

declare global {
  interface Window {
    $location: Location
  }
}
