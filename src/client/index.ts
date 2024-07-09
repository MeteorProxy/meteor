import './apis/requests'
import './dom'
import './storage'

declare global {
  interface Window {
    __location: Location
  }
}
