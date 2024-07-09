import './apis/requests'
import './apis/storage'
import './dom'

declare global {
  interface Window {
    $location: Location
  }
}
