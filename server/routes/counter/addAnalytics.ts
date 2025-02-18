import getHeaders from '~/server/utils/getHeaders.ts'
import db from '~/server/utils/pool.ts'
import { ERROR_CODES } from '~/server/db/codes.ts'
import { initTableCounter } from '~/server/db/init.ts'
import geoIP from '~/server/utils/geoip.ts'
import type { TCounterRequest } from '~/server/routes/counter/types.ts'

type TAnalyticsResponse = Promise<{ meassge?: string; error?: string }>
const defaultCounter = 'badge'

const addAnalytics = (req: TCounterRequest): TAnalyticsResponse => {
  const { ip, platform, agent, isMobile } = getHeaders(req)
  const { country } = ip ? geoIP(ip) : { country: null }
  const { name } = req.params
  const { type, title, color } = req.query

  const addAnalyticsRecord = () =>
    db.pool.query(
      `INSERT INTO "${name}" (ip, country, platform, agent, is_mobile, title, color, type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [ip, country, platform, agent, isMobile, title, color, type ?? defaultCounter],
    )

  return addAnalyticsRecord().then(() => ({ meassge: 'Success!' })).catch((error) => {
    if (error.code === ERROR_CODES.relation) {
      console.log(`No \x1b[33m${name}\x1b[0m table found: creating...`)
      return db.pool.query(initTableCounter(name)).then(() =>
        addAnalyticsRecord().then(() => ({ meassge: 'Success!' })).catch((err) => {
          console.log(`Adding analytics to \x1b[33m${name}\x1b[0m table: Failed:`, err.message)
          return { error: err.message }
        })
      ).catch((err) => {
        console.log(`Create \x1b[33m${name}\x1b[0m table: Failed:`, err.message)
        return { error: err.message }
      })
    } else {
      console.log(`Adding analytics to \x1b[33m${name}\x1b[0m table: Failed:\n`, error)
      return { error: error.message }
    }
  })
}

export default addAnalytics
