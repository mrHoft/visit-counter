import denoJson from '~/deno.json' with { type: 'json' }

const { version } = denoJson

export default function getVersion() {
  return version
}
