import { React, ReactDomClient } from '../utils/deps.ts' // Relative path for deno bundler
import App from './app.tsx'

const root = document.getElementById('app')

if (root) {
  ReactDomClient.hydrateRoot(root, <App />)
}
