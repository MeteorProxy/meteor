import './apis'
import './dom'
import './storage'

declare global {
  interface Window {
    __location: Location
  }
}
