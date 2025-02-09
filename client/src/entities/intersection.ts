export default class Intersection {
  private _observer: IntersectionObserver

  constructor(element: HTMLElement, callback: (intersected: boolean) => void) {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.9,
    }

    this._observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        callback(entry.intersectionRatio >= 0.9)
      })
    }, options)

    this._observer.observe(element)
  }

  public disconnect() {
    this._observer.disconnect()
  }
}
