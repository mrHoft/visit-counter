import { React, ReactDomClient } from '../utils/deps.ts' // Relative path for deno bundler
import App from './app.tsx'
import type { TUser } from './api/types.ts'
import storeUser from './entities/user.ts'
import storeStats, { type TStats } from './entities/stats.ts'
import { scribe } from './scribe.ts'

declare global {
  var __INITIAL_USER__: TUser | undefined
  var __INITIAL_STATS__: TStats | undefined
}

if (typeof document !== 'undefined') {
  console.log(scribe)
  const root = document.getElementById('app')
  if (root) {
    ReactDomClient.hydrateRoot(root, <App initialUser={globalThis.__INITIAL_USER__} />)
  }

  if (globalThis.__INITIAL_USER__) storeUser.user = { ...globalThis.__INITIAL_USER__ }
  if (globalThis.__INITIAL_STATS__) storeStats.stats = { ...globalThis.__INITIAL_STATS__ }

  delete globalThis.__INITIAL_USER__
  delete globalThis.__INITIAL_STATS__
  document.querySelector('#state-outlet')?.remove()
}
