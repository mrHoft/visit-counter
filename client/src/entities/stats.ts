import EventEmitter from '../../utils/eventEmitter.ts'

export type TStats = {
  counters: number
  users: number
  requests: number
  host: string
  ip: string
  version: string
}

class StoreStats extends EventEmitter {
  private _stats: TStats = { counters: 0, users: 0, requests: 0, host: '', ip: '', version: '' }

  public get stats() {
    return this._stats
  }

  public set stats(value: TStats) {
    this._stats = value
    this.emit('update')
  }
}

const storeStats = new StoreStats()
export default storeStats
