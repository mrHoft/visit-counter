import { React } from '../../utils/deps.ts'
import { ButtonSecondary } from '../ui/button.tsx'
import type { TMode } from './menu.tsx'

type TAnalyticsProps = { modeChange: (mode: TMode) => void }

export default function Analytics({ modeChange }: TAnalyticsProps) {
  return (
    <>
      <h3>Analytics</h3>
      <p>Not implemented.</p>
      <ButtonSecondary onClick={() => modeChange('menu')}>Back</ButtonSecondary>
    </>
  )
}
