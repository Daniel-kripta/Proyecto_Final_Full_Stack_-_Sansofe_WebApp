export interface Coleccion {
  id: string
  nombre: string
  _count: { articulos: number }
}

export interface ArticuloRef {
  id: string
  headline: string
  date: string
  publication: string
  url: string
}

export interface MensajeUsuario {
  id: string
  role: 'user'
  content: string
}

export interface MensajeAsistente {
  id: string
  role: 'assistant'
  type: 'lista' | 'sintesis' | 'irrelevante'
  content: string
  sources?: ArticuloRef[]
}

export type Mensaje = MensajeUsuario | MensajeAsistente
