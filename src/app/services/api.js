const API_BASE = 'https://api.almacontrol.shop/api'

// ── Helpers ─────────────────────────────────────────────────────────────────
const authHeaders = () => ({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('almacontrol_token')}`,
})

const handleResponse = async (res) => {
  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch (err) {
    // Si no es JSON (ej. página de error HTML), lanzamos un error legible
    throw new Error(`Error del servidor (${res.status}): La respuesta no es JSON válido.`)
  }
  if (!res.ok) throw data
  return data
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export const login = (correo, contrasena) =>
  fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena }),
  }).then(handleResponse)

export const register = (data) =>
  fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse)

export const logout = () =>
  fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: authHeaders(),
  }).then(handleResponse)

export const getMe = () =>
  fetch(`${API_BASE}/auth/me`, { headers: authHeaders() }).then(handleResponse)

// ── Dashboard ────────────────────────────────────────────────────────────────
export const getDashboard = () =>
  fetch(`${API_BASE}/dashboard`, { headers: authHeaders() }).then(handleResponse)

// ── Productos ────────────────────────────────────────────────────────────────
export const getProductos = (page = 1) =>
  fetch(`${API_BASE}/productos?page=${page}`, { headers: authHeaders() }).then(handleResponse)

export const getProducto = (id) =>
  fetch(`${API_BASE}/productos/${id}`, { headers: authHeaders() }).then(handleResponse)

export const createProducto = (data) =>
  fetch(`${API_BASE}/productos`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse)

export const updateProducto = (id, data) =>
  fetch(`${API_BASE}/productos/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse)

export const deleteProducto = (id) =>
  fetch(`${API_BASE}/productos/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }).then(handleResponse)

// ── Almacenes ────────────────────────────────────────────────────────────────
export const getAlmacenes = () =>
  fetch(`${API_BASE}/almacenes`, { headers: authHeaders() }).then(handleResponse)

export const createAlmacen = (data) =>
  fetch(`${API_BASE}/almacenes`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse)

export const updateAlmacen = (id, data) =>
  fetch(`${API_BASE}/almacenes/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse)

export const deleteAlmacen = (id) =>
  fetch(`${API_BASE}/almacenes/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }).then(handleResponse)

// ── Proveedores ───────────────────────────────────────────────────────────────
export const getProveedores = () =>
  fetch(`${API_BASE}/proveedores`, { headers: authHeaders() }).then(handleResponse)

export const createProveedor = (data) =>
  fetch(`${API_BASE}/proveedores`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse)

export const updateProveedor = (id, data) =>
  fetch(`${API_BASE}/proveedores/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse)

export const deleteProveedor = (id) =>
  fetch(`${API_BASE}/proveedores/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }).then(handleResponse)

// ── Inventario ───────────────────────────────────────────────────────────────
export const getInventario = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return fetch(`${API_BASE}/inventario${qs ? '?' + qs : ''}`, { headers: authHeaders() }).then(handleResponse)
}

export const registrarEntrada = (data) =>
  fetch(`${API_BASE}/inventario/entrada`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse)

export const registrarSalida = (data) =>
  fetch(`${API_BASE}/inventario/salida`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse)

export const getMovimientos = (params = {}) => {
  const qs = new URLSearchParams(params).toString()
  return fetch(`${API_BASE}/movimientos${qs ? '?' + qs : ''}`, { headers: authHeaders() }).then(handleResponse)
}

// ── Órdenes ───────────────────────────────────────────────────────────────────
export const getOrdenes = (page = 1) =>
  fetch(`${API_BASE}/ordenes?page=${page}`, { headers: authHeaders() }).then(handleResponse)

export const createOrden = (data) =>
  fetch(`${API_BASE}/ordenes`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse)

export const cambiarEstadoOrden = (id, estado) =>
  fetch(`${API_BASE}/ordenes/${id}/estado`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ estado }),
  }).then(handleResponse)

// ── Alertas ───────────────────────────────────────────────────────────────────
export const getAlertas = () =>
  fetch(`${API_BASE}/alertas`, { headers: authHeaders() }).then(handleResponse)

export const marcarAlertaLeida = (id) =>
  fetch(`${API_BASE}/alertas/${id}/leer`, {
    method: 'PUT',
    headers: authHeaders(),
  }).then(handleResponse)

export const marcarTodasLeidas = () =>
  fetch(`${API_BASE}/alertas/leer-todas`, {
    method: 'PUT',
    headers: authHeaders(),
  }).then(handleResponse)

// ── Categorías (para formularios) ────────────────────────────────────────────
export const getCategorias = () =>
  fetch(`${API_BASE}/categorias`, { headers: authHeaders() }).then(handleResponse)

// ── Ubicaciones (mapa del almacén) ───────────────────────────────────────────
export const getUbicaciones = (almacenId) =>
  fetch(`${API_BASE}/almacenes/${almacenId}/ubicaciones`, { headers: authHeaders() }).then(handleResponse)

export const getMapaAlmacen = (almacenId) =>
  fetch(`${API_BASE}/almacenes/${almacenId}/mapa`, { headers: authHeaders() }).then(handleResponse)

export const createUbicacion = (almacenId, data) =>
  fetch(`${API_BASE}/almacenes/${almacenId}/ubicaciones`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse)

export const deleteUbicacion = (id) =>
  fetch(`${API_BASE}/ubicaciones/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }).then(handleResponse)

// ── Búsqueda por código de barras / QR ───────────────────────────────────────
export const buscarProductoPorCodigo = (codigo) =>
  fetch(`${API_BASE}/productos/buscar?codigo=${encodeURIComponent(codigo)}`, {
    headers: authHeaders(),
  }).then(handleResponse)

// ── Reportes CSV ──────────────────────────────────────────────────────────────
const downloadCsv = async (url, filename) => {
  const res = await fetch(url, { headers: authHeaders() })
  if (!res.ok) throw new Error('Error al generar el reporte')
  const blob = await res.blob()
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

export const exportarInventarioCsv = () =>
  downloadCsv(
    `${API_BASE}/reportes/inventario-csv`,
    `inventario_${new Date().toISOString().slice(0,10)}.csv`
  )

export const exportarMovimientosCsv = (params = {}) => {
  const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([, v]) => v))).toString()
  return downloadCsv(
    `${API_BASE}/reportes/movimientos-csv${qs ? '?' + qs : ''}`,
    `movimientos_${new Date().toISOString().slice(0,10)}.csv`
  )
}
