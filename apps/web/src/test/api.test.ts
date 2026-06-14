import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'

const BASE = 'http://localhost:3002'

function mockOk(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  } as Response)
}

function mockFail(status: number) {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve({ error: 'Error' }),
  } as Response)
}

describe('api/auth', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => { fetchSpy = vi.spyOn(global, 'fetch') })
  afterEach(() => { fetchSpy.mockRestore() })

  it('login llama a POST /auth/login con credenciales', async () => {
    fetchSpy.mockReturnValue(mockOk({ ok: true, usuario: { email: 'a@b.com', username: 'user' } }))
    const { login } = await import('../api/auth')

    const result = await login('a@b.com', 'pass1234')

    expect(fetchSpy).toHaveBeenCalledWith(
      `${BASE}/auth/login`,
      expect.objectContaining({ method: 'POST', credentials: 'include' })
    )
    expect(result.usuario.email).toBe('a@b.com')
  })

  it('login lanza error si la respuesta no es ok', async () => {
    fetchSpy.mockReturnValue(mockOk({ error: 'Credenciales incorrectas' }, 401))
    const { login } = await import('../api/auth')

    await expect(login('a@b.com', 'wrong')).rejects.toThrow('Credenciales incorrectas')
  })

  it('registro llama a POST /auth/registro', async () => {
    fetchSpy.mockReturnValue(mockOk({ ok: true, usuario: { email: 'a@b.com', username: 'user' } }))
    const { registro } = await import('../api/auth')

    await registro('a@b.com', 'pass1234', 'user')

    expect(fetchSpy).toHaveBeenCalledWith(
      `${BASE}/auth/registro`,
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('logout llama a POST /auth/logout', async () => {
    fetchSpy.mockReturnValue(mockOk({ ok: true }))
    const { logout } = await import('../api/auth')

    await logout()

    expect(fetchSpy).toHaveBeenCalledWith(
      `${BASE}/auth/logout`,
      expect.objectContaining({ method: 'POST' })
    )
  })
})

describe('api/colecciones', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => { fetchSpy = vi.spyOn(global, 'fetch') })
  afterEach(() => { fetchSpy.mockRestore() })

  it('getColecciones llama a GET /colecciones', async () => {
    fetchSpy.mockReturnValue(mockOk([]))
    const { getColecciones } = await import('../api/colecciones')

    await getColecciones()

    expect(fetchSpy).toHaveBeenCalledWith(`${BASE}/colecciones`, expect.objectContaining({ credentials: 'include' }))
  })

  it('getColeccion llama a GET /colecciones/:id', async () => {
    fetchSpy.mockReturnValue(mockOk({ id: 'col-1', nombre: 'Test', articulos: [] }))
    const { getColeccion } = await import('../api/colecciones')

    const result = await getColeccion('col-1')

    expect(fetchSpy).toHaveBeenCalledWith(`${BASE}/colecciones/col-1`, expect.anything())
    expect(result.id).toBe('col-1')
  })

  it('crearColeccion llama a POST /colecciones con nombre', async () => {
    fetchSpy.mockReturnValue(mockOk({ id: 'col-2', nombre: 'Nueva' }))
    const { crearColeccion } = await import('../api/colecciones')

    await crearColeccion('Nueva')

    expect(fetchSpy).toHaveBeenCalledWith(
      `${BASE}/colecciones`,
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('eliminarColeccion llama a DELETE /colecciones/:id', async () => {
    fetchSpy.mockReturnValue(mockOk({ ok: true }))
    const { eliminarColeccion } = await import('../api/colecciones')

    await eliminarColeccion('col-1')

    expect(fetchSpy).toHaveBeenCalledWith(`${BASE}/colecciones/col-1`, expect.objectContaining({ method: 'DELETE' }))
  })

  it('guardarEnColeccion llama a POST /colecciones/:id/articulos', async () => {
    fetchSpy.mockReturnValue(mockOk({}))
    const { guardarEnColeccion } = await import('../api/colecciones')

    await guardarEnColeccion('col-1', 'art-1')

    expect(fetchSpy).toHaveBeenCalledWith(`${BASE}/colecciones/col-1/articulos`, expect.objectContaining({ method: 'POST' }))
  })

  it('eliminarDeColeccion llama a DELETE /colecciones/:id/articulos/:aid', async () => {
    fetchSpy.mockReturnValue(mockOk({ ok: true }))
    const { eliminarDeColeccion } = await import('../api/colecciones')

    await eliminarDeColeccion('col-1', 'art-1')

    expect(fetchSpy).toHaveBeenCalledWith(`${BASE}/colecciones/col-1/articulos/art-1`, expect.objectContaining({ method: 'DELETE' }))
  })

  it('lanza Error si la respuesta no es ok', async () => {
    fetchSpy.mockReturnValue(mockFail(500))
    const { getColecciones } = await import('../api/colecciones')

    await expect(getColecciones()).rejects.toThrow('Error')
  })
})

describe('api/investigaciones', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => { fetchSpy = vi.spyOn(global, 'fetch') })
  afterEach(() => { fetchSpy.mockRestore() })

  it('getInvestigaciones llama a GET /investigaciones', async () => {
    fetchSpy.mockReturnValue(mockOk([]))
    const { getInvestigaciones } = await import('../api/investigaciones')

    await getInvestigaciones()

    expect(fetchSpy).toHaveBeenCalledWith(`${BASE}/investigaciones`, expect.anything())
  })

  it('crearInvestigacion llama a POST /investigaciones con titulo y mensajes', async () => {
    fetchSpy.mockReturnValue(mockOk({ id: 'inv-1', titulo: 'Test' }))
    const { crearInvestigacion } = await import('../api/investigaciones')

    await crearInvestigacion('Test', [])

    expect(fetchSpy).toHaveBeenCalledWith(
      `${BASE}/investigaciones`,
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('eliminarInvestigacion llama a DELETE /investigaciones/:id', async () => {
    fetchSpy.mockReturnValue(mockOk({ ok: true }))
    const { eliminarInvestigacion } = await import('../api/investigaciones')

    await eliminarInvestigacion('inv-1')

    expect(fetchSpy).toHaveBeenCalledWith(`${BASE}/investigaciones/inv-1`, expect.objectContaining({ method: 'DELETE' }))
  })
})

describe('api/perfil', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => { fetchSpy = vi.spyOn(global, 'fetch') })
  afterEach(() => { fetchSpy.mockRestore() })

  it('getPerfil llama a GET /perfil', async () => {
    fetchSpy.mockReturnValue(mockOk({ username: 'user' }))
    const { getPerfil } = await import('../api/perfil')

    await getPerfil()

    expect(fetchSpy).toHaveBeenCalledWith(`${BASE}/perfil`, expect.anything())
  })

  it('testApiKey llama a GET /perfil/test-key', async () => {
    fetchSpy.mockReturnValue(mockOk({ ok: true }))
    const { testApiKey } = await import('../api/perfil')

    const result = await testApiKey()

    expect(fetchSpy).toHaveBeenCalledWith(`${BASE}/perfil/test-key`, expect.anything())
    expect(result.ok).toBe(true)
  })

  it('lanza UNAUTHORIZED si la respuesta es 401', async () => {
    fetchSpy.mockReturnValue(Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({}) } as Response))
    const { getPerfil } = await import('../api/perfil')

    await expect(getPerfil()).rejects.toThrow('UNAUTHORIZED')
  })

  it('guardarApiKey llama a PUT /perfil', async () => {
    fetchSpy.mockReturnValue(mockOk({}))
    const { guardarApiKey } = await import('../api/perfil')

    await guardarApiKey('mi-clave')

    expect(fetchSpy).toHaveBeenCalledWith(`${BASE}/perfil`, expect.objectContaining({ method: 'PUT' }))
  })

  it('cambiarPassword llama a PUT /perfil/password', async () => {
    fetchSpy.mockReturnValue(mockOk({}))
    const { cambiarPassword } = await import('../api/perfil')

    await cambiarPassword('vieja', 'nueva1234')

    expect(fetchSpy).toHaveBeenCalledWith(`${BASE}/perfil/password`, expect.objectContaining({ method: 'PUT' }))
  })
})

describe('api/chat', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => { fetchSpy = vi.spyOn(global, 'fetch') })
  afterEach(() => { fetchSpy.mockRestore() })

  it('enviarMensaje llama a POST /chat', async () => {
    fetchSpy.mockReturnValue(mockOk({ type: 'lista', content: 'Resultado', sources: [] }))
    const { enviarMensaje } = await import('../api/chat')

    const result = await enviarMensaje('consulta', 10, null)

    expect(fetchSpy).toHaveBeenCalledWith(`${BASE}/chat`, expect.objectContaining({ method: 'POST' }))
    expect(result.type).toBe('lista')
  })

  it('enviarMensaje lanza UNAUTHORIZED con 401', async () => {
    fetchSpy.mockReturnValue(Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({}) } as Response))
    const { enviarMensaje } = await import('../api/chat')

    await expect(enviarMensaje('consulta', 10, null)).rejects.toThrow('UNAUTHORIZED')
  })

  it('enviarMensaje lanza API_KEY_REQUIRED con 402', async () => {
    fetchSpy.mockReturnValue(Promise.resolve({ ok: false, status: 402, json: () => Promise.resolve({}) } as Response))
    const { enviarMensaje } = await import('../api/chat')

    await expect(enviarMensaje('consulta', 10, null)).rejects.toThrow('API_KEY_REQUIRED')
  })

  it('enviarMensaje incluye coleccion_id si se proporciona', async () => {
    fetchSpy.mockReturnValue(mockOk({ type: 'sintesis', content: 'Resultado', sources: [] }))
    const { enviarMensaje } = await import('../api/chat')

    await enviarMensaje('consulta', 10, null, 'col-1', null)

    const body = JSON.parse((fetchSpy.mock.calls[0][1] as RequestInit).body as string)
    expect(body.coleccion_id).toBe('col-1')
  })

  it('checkSalud devuelve true si el servidor responde ok', async () => {
    fetchSpy.mockReturnValue(mockOk({ ok: true }))
    const { checkSalud } = await import('../api/chat')

    const result = await checkSalud()

    expect(result).toBe(true)
  })

  it('checkSalud devuelve false si falla la conexión', async () => {
    fetchSpy.mockRejectedValue(new Error('Network error'))
    const { checkSalud } = await import('../api/chat')

    const result = await checkSalud()

    expect(result).toBe(false)
  })
})

describe('api/articulos', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => { fetchSpy = vi.spyOn(global, 'fetch') })
  afterEach(() => { fetchSpy.mockRestore() })

  it('getPublicaciones devuelve array de strings', async () => {
    fetchSpy.mockReturnValue(mockOk(['El Día', 'La Prensa']))
    const { getPublicaciones } = await import('../api/articulos')

    const result = await getPublicaciones()

    expect(result).toEqual(['El Día', 'La Prensa'])
  })

  it('getPublicaciones devuelve [] si la respuesta no es ok', async () => {
    fetchSpy.mockReturnValue(mockFail(500))
    const { getPublicaciones } = await import('../api/articulos')

    const result = await getPublicaciones()

    expect(result).toEqual([])
  })

  it('getArticulo llama a GET /articulos/:id', async () => {
    const articulo = { id: 'art-1', headline: 'Titular' }
    fetchSpy.mockReturnValue(mockOk(articulo))
    const { getArticulo } = await import('../api/articulos')

    const result = await getArticulo('art-1')

    expect(fetchSpy).toHaveBeenCalledWith(`${BASE}/articulos/art-1`)
    expect(result.id).toBe('art-1')
  })

  it('getArticulo lanza error si no existe', async () => {
    fetchSpy.mockReturnValue(mockFail(404))
    const { getArticulo } = await import('../api/articulos')

    await expect(getArticulo('no-existe')).rejects.toThrow('Artículo no encontrado')
  })

  it('buscarArticulos construye la query string correctamente', async () => {
    fetchSpy.mockReturnValue(mockOk([]))
    const { buscarArticulos } = await import('../api/articulos')

    await buscarArticulos({ q: 'canarias', publication: 'El Día', genre: '' })

    const url = new URL((fetchSpy.mock.calls[0][0] as string))
    expect(url.searchParams.get('q')).toBe('canarias')
    expect(url.searchParams.get('publication')).toBe('El Día')
    expect(url.searchParams.has('genre')).toBe(false)
  })

  it('buscarArticulos lanza error si la respuesta no es ok', async () => {
    fetchSpy.mockReturnValue(mockFail(500))
    const { buscarArticulos } = await import('../api/articulos')

    await expect(buscarArticulos({ q: 'test' })).rejects.toThrow('Error en la búsqueda')
  })
})
