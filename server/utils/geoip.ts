import { closeSync, fstatSync, openSync, readSync } from 'node:fs'
import path from 'node:path'
import { Buffer } from 'node:buffer'
import { isIP } from 'node:net'

const geodataDir = path.resolve(import.meta.dirname ?? '', '../data')

const utils = {
  ipToN4: function (ip: string) {
    const a = ip.split('.')
    return (
      ((parseInt(a[0], 10) << 24) >>> 0) +
      ((parseInt(a[1], 10) << 16) >>> 0) +
      ((parseInt(a[2], 10) << 8) >>> 0) +
      (parseInt(a[3], 10) >>> 0)
    )
  },
}

type TConf4 = {
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
  private cache4: TConf4 = {
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
    if (!this.cache4.firstIP || !this.cache4.lastIP || !this.cache4.mainBuffer) {
      console.error('GeoIP: No data')
      return
    }

    if (ip > this.cache4.lastIP || ip < this.cache4.firstIP) {
      return
    }

    let fline = 0
    let cline = this.cache4.lastLine
    const buffer = this.cache4.mainBuffer!
    const recordSize = this.cache4.recordSize
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
    this.cache4.recordSize = this.RECORD_SIZE

    this.cache4.mainBuffer = Buffer.alloc(datSize)
    readSync(datFile, this.cache4.mainBuffer, 0, datSize, 0)
    closeSync(datFile)

    this.cache4.lastLine = datSize / this.cache4.recordSize - 1
    this.cache4.lastIP = this.cache4.mainBuffer.readUInt32BE(this.cache4.lastLine * this.cache4.recordSize + 4)
    this.cache4.firstIP = this.cache4.mainBuffer.readUInt32BE(0)
    console.log('GeoIP: records loaded:', this.cache4.lastLine)
  }

  public lookup = (ip: string) => {
    if (!ip) {
      return { country: null }
    } else if (isIP(ip) === 4) {
      return this.lookup4(utils.ipToN4(ip)) ?? { country: null }
    }

    return { country: null }
  }
}

const geoIP = new GeoIP().lookup
export default geoIP
