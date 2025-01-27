import { React } from '../../utils/deps.ts'

type TModal = ({ children }: { children?: React.ReactNode }) => React.JSX.Element
interface IModal extends TModal {
  show: (children?: React.ReactNode) => void
  close: (reset?: boolean) => void
}
type TState = { visible: boolean; children: React.ReactNode | null; reset: boolean }

const Modal: IModal = (() => {
  const func: Record<string, React.Dispatch<React.SetStateAction<TState>>> = {}

  const ModalWrapper = ({ children }: { children?: React.ReactNode }) => {
    const [state, setState] = React.useState<TState>({ visible: false, children, reset: false })
    func.setState = setState

    const handleClick = (event: React.MouseEvent) => {
      if (!state.visible) return
      const { target, currentTarget } = event
      if (target === currentTarget) {
        event.preventDefault()
        closeModal()
      }
    }

    const closeModal = () => setState(prev => ({ ...prev, visible: false, reset: true }))

    return (
      <div className={state.visible ? 'modal' : 'hidden'} onClick={handleClick}>
        <div className="modal__inner">
          <div className="modal__close" onClick={closeModal}>
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="4" y1="20" x2="20" y2="4" />
            </svg>
          </div>
          {!state.reset && state.children}
        </div>
      </div>
    )
  }

  ModalWrapper.show = (children?: React.ReactNode) => {
    if (children && func.setState) func.setState({ visible: true, children, reset: false })
    else if (func.setState) func.setState(prev => ({ ...prev, visible: true, reset: false }))
  }

  ModalWrapper.close = (reset: boolean = false) => func.setState(prev => ({ ...prev, visible: false, reset }))

  return ModalWrapper
})()

export default Modal
