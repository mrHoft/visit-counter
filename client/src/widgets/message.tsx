import { React } from '../../utils/deps.ts'

type TMode = 'regular' | 'error'
type TChildren = JSX.Element | string
interface MessageShow {
  (children: TChildren, mode?: TMode): void
}
interface MessageComponent {
  show: MessageShow
  (): JSX.Element
}
type TMessage = { id: number; children: TChildren; mode: TMode; hidden?: boolean }

const Message: MessageComponent = (() => {
  const state: {
    set: React.Dispatch<React.SetStateAction<TMessage[]>> | null
  } = { set: null }

  const Container = () => {
    const [children, setChildren] = React.useState<TMessage[]>([])
    state.set = setChildren

    return (
      <div className="messages">
        {children.map(({ id, children, mode, hidden }) => (
          <div key={id} className={`${hidden ? 'messages__item hidden' : 'messages__item'}`}>
            {mode === 'error' ? (
              <div className="messages__item_icon" style={{ backgroundColor: 'gray' }}>
                {'\u274C'}
              </div>
            ) : (
              <div className="messages__item_icon">{'\u2714'}</div>
            )}
            {children}
          </div>
        ))}
      </div>
    )
  }

  Container.show = (children: TChildren, mode: TMode = 'regular') => {
    if (children && state.set) {
      const id = Date.now()
      state.set(prev => [...prev, { id, children, mode }])
      setTimeout(() => {
        if (state.set) state.set(prev => prev.map(item => (item.id === id ? { ...item, hidden: true } : item)))
        setTimeout(() => {
          if (state.set) state.set(prev => prev.filter(item => item.id !== id))
        }, 500)
      }, 3000)
    }
  }

  return Container
})()

export default Message
