import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <p style={{ padding: '2rem', textAlign: 'center' }}>
          Algo ha ido mal. <a href="/">Volver al inicio</a>
        </p>
      )
    }
    return this.props.children
  }
}
