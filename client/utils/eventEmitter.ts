interface Callback<T = unknown> {
  (...args: T[]): void
}

export default class EventEmitter {
  protected listeners: { [key: string]: Callback[] } = {}

  public on<T>(event: string, callback: Callback<T>) {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(callback as Callback)
  }

  protected off<T>(event: string, callback: Callback<T>) {
    if (!this.listeners[event]) throw new Error(`No event: ${event}`)
    this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback)
  }

  protected emit(event: string, ...args: unknown[]) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => {
        callback(...args)
      })
    }
  }

  protected clear() {
    this.listeners = {}
  }
}
