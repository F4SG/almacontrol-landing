const API_BASE = 'http://localhost:8000/api'

// ── Helpers ─────────────────────────────────────────────────────────────────
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('almacontrol_token')}`,
})

const handleResponse = async (res) => {
  const data = await res.json()
  if (!res.ok) throw data
  return data
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export const login = (correo, contrasena) =>
  fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, contrasena }),
  }).then(handleResponse)

export const register = (data) =>
  fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
