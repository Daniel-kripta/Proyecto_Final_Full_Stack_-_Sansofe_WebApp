import styles from './ErrorPage.module.css'

const MENSAJES = {
  not_found: {
    codigo: '404',
    titulo: 'Página no encontrada',
    descripcion: 'La dirección que has introducido no existe.',
  },
  load_error: {
    codigo: '—',
    titulo: 'Error al cargar',
    descripcion: 'No se pudo obtener el contenido. Inténtalo de nuevo más tarde.',
  },
  generic: {
    codigo: '—',
    titulo: 'Algo ha ido mal',
    descripcion: 'Ha ocurrido un error inesperado.',
  },
}

interface Props {
  type: keyof typeof MENSAJES
}

export function ErrorPage({ type }: Props) {
  const { codigo, titulo, descripcion } = MENSAJES[type]

  return (
    <div className={styles.pagina}>
      <section className={styles.seccion}>
        <span className={styles.codigo}>{codigo}</span>
        <h1 className={styles.titulo}>{titulo}</h1>
        <p className={styles.descripcion}>{descripcion}</p>
      </section>
    </div>
  )
}
