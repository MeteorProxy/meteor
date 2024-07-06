import './apis'
import './dom'

declare global {
  interface Window {
      __location: Location;
  }
}