import { React, ReactDomClient } from '../utils/deps.ts' // Relative path for deno bundler
import App from './app.tsx'
import type { TUser } from './api/types.ts'
import storeUser from './entities/user.ts'

declare global {
  // deno-lint-ignore no-var
  var __INITIAL_USER_STATE__: TUser | undefined
}

if (globalThis.__INITIAL_USER_STATE__) storeUser.user = { ...globalThis.__INITIAL_USER_STATE__ }

const root = document.getElementById('app')

if (root) {
  ReactDomClient.hydrateRoot(root, <App initialUser={globalThis.__INITIAL_USER_STATE__} />)
}

if (typeof document !== 'undefined') {
  delete globalThis.__INITIAL_USER_STATE__
  document.querySelector('#state-outlet')?.remove()
}
