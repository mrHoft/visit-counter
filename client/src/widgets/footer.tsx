import { React } from '../../utils/deps.ts'

export default function Footer({ server }: { server?: boolean }) {
  const [isClient, setIsClient] = server ? [false, () => {}] : React.useState(false)

  if (!server) {
    React.useEffect(() => {
      setIsClient(true)
    }, [])
  }

  return (
    <footer className="footer">
      <div>
        Hydration status: <span style={{ color: isClient ? 'green' : 'red' }}>{isClient ? 'online' : 'offline'}</span>
      </div>
      <div className="copyright">
        <span>&copy; 2025 </span>
        <a href="https://github.com/mrHoft/visit-counter" target="_blank">
          mrHoft
        </a>
      </div>
    </footer>
  )
}
