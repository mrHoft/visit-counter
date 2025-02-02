import { React } from '../../utils/deps.ts'
import storeStats from '../entities/stats.ts'

type TFooterProps = { server?: boolean }

export default function Footer({ server }: TFooterProps) {
  const [version, setVersion] = server ? [null, () => {}] : React.useState<string | null>(null)

  if (!server) {
    React.useEffect(() => {
      setVersion(storeStats.stats.version ? `v.${storeStats.stats.version}` : null)
    }, [])
  }

  return (
    <footer className="footer">
      <div className="copyright">
        <span>&copy; 2025 </span>
        <a href="https://github.com/mrHoft/visit-counter" target="_blank">
          mrHoft
        </a>
      </div>
      <div>{version}</div>
    </footer>
  )
}
