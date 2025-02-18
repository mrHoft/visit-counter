import { closeSync, fstatSync, openSync, readSync } from 'node:fs'
import path from 'node:path'
import { Buffer } from 'node:buffer'
import { isIP } from 'node:net'
import { ipToNumber } from './ip.ts'

const geodataDir = path.resolve(import.meta.dirname ?? '', '../data')

type TCache = {
  firstIP: number | null
  lastIP: number | null
  lastLine: number
  locationBuffer: number | null
  locationRecordSize: number
  mainBuffer: Buffer | null
  recordSize: number
}
type TGeoIP = { country: string | null }

class GeoIP {
  private RECORD_SIZE = 10
  private dataFiles = {
    country: path.join(geodataDir, 'geoip-country.dat'),
  }
  private cache: TCache = {
    firstIP: null,
    lastIP: null,
    lastLine: 0,
    locationBuffer: null,
    locationRecordSize: 88,
    mainBuffer: null,
    recordSize: 24,
  }

  constructor() {
    this.preload()
  }

  private lookup4 = (ip: number): TGeoIP | undefined => {
    if (!this.cache.firstIP || !this.cache.lastIP || !this.cache.mainBuffer) {
      console.error('GeoIP: No data')
      return
    }

    if (ip > this.cache.lastIP || ip < this.cache.firstIP) {
      return
    }

    let fline = 0
    let cline = this.cache.lastLine
    const buffer = this.cache.mainBuffer!
    const recordSize = this.cache.recordSize
    const geodata: TGeoIP = {
      country: '',
    }

    do {
      const line = Math.round((cline - fline) / 2) + fline
      const floor = buffer.readUInt32BE(line * recordSize)
      const ceil = buffer.readUInt32BE(line * recordSize + 4)

      if (floor <= ip && ceil >= ip) {
        geodata.country = buffer.toString('utf8', line * recordSize + 8, line * recordSize + 10)

        return geodata
      } else if (fline === cline) {
        return
      } else if (fline === cline - 1) {
        if (line === fline) {
          fline = cline
        } else {
          cline = fline
        }
      } else if (floor > ip) {
        cline = line
      } else if (ceil < ip) {
        fline = line
      }
    } while (1)
  }

  private preload = () => {
    const datFile = openSync(this.dataFiles.country, 'r')
    const datSize = fstatSync(datFile).size
    this.cache.recordSize = this.RECORD_SIZE

    this.cache.mainBuffer = Buffer.alloc(datSize)
    readSync(datFile, this.cache.mainBuffer, 0, datSize, 0)
    closeSync(datFile)

    this.cache.lastLine = datSize / this.cache.recordSize - 1
    this.cache.lastIP = this.cache.mainBuffer.readUInt32BE(this.cache.lastLine * this.cache.recordSize + 4)
    this.cache.firstIP = this.cache.mainBuffer.readUInt32BE(0)
    console.log('GeoIP: records loaded:', this.cache.lastLine)
  }

  public lookup = (ip: string) => {
    if (!ip) {
      return { country: null }
    } else if (isIP(ip) === 4) {
      return this.lookup4(ipToNumber(ip)) ?? { country: null }
    }

    return { country: null }
  }
}

const geoIP = new GeoIP().lookup
export default geoIP
