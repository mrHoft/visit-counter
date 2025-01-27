import { React } from '../../utils/deps.ts' // Relative path for deno bundler
import { ButtonSecondary } from '../ui/button.tsx'
import storeUser from '../entities/user.ts'

export default function LogoutButton() {
  const handleLogout = () => {
    storeUser.user = undefined
  }

  return <ButtonSecondary onClick={handleLogout}>Logout</ButtonSecondary>
}
