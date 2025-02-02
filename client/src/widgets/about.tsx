import { React } from '../../utils/deps.ts'
import { ButtonSecondary } from '../ui/button.tsx'
import type { TMode } from './menu.tsx'
import storeStats from '../entities/stats.ts'

type TAboutProps = { modeChange: (mode: TMode) => void }

export default function About({ modeChange }: TAboutProps) {
  const APP_HOST = storeStats.stats.host

  return (
    <>
      <h3>About</h3>
      <div>
        <p>Visitor counter project for self usage.</p>
        <div>Counter:</div>
        <code className="link">{`${APP_HOST}/<conter-name>/?type=badge&title=Visits&color=blue`}</code>
        <p>Optional query parameters:</p>
        <ul>
          <li>type: 'badge' | 'number' | 'classic'</li>
          <li>title: string</li>
          <li>color: string</li>
        </ul>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <ButtonSecondary onClick={() => modeChange('menu')}>Back</ButtonSecondary>
      </div>
    </>
  )
}
