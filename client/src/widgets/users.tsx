import { React } from '../../utils/deps.ts'
import { ButtonSecondary } from '../ui/button.tsx'
import type { TMode } from './menu.tsx'

type TManageUsersProps = { modeChange: (mode: TMode) => void }

export default function ManageUsers({ modeChange }: TManageUsersProps) {
  return (
    <>
      <h3>Manage users</h3>
      <p>Not implemented.</p>
      <ButtonSecondary onClick={() => modeChange('menu')}>Back</ButtonSecondary>
    </>
  )
}
