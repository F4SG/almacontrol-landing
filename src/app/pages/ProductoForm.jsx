import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getProducto, createProducto, updateProducto } from '../services/api'
import Spinner from '../components/Spinner'
import { ArrowLeft, Save } from 'lucide-react'

const API_BASE = 'http://apialmacontrol.infinityfreeapp.com/api'
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('almacontrol_token')}`,
})

const INIT = {
  nombre: '', id_categoria: '', id_proveedor: '',
  descripcion: '', unidad_medida: '', precio_costo: '',
  precio_venta: '', stock_minimo: '0', codigo_barras: '',
  codigo_interno: '', activo: true,
}

export default function ProductoForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm]         = useState(INIT)
  const [categorias, setCategorias] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(isEdit)
  const [saving, setSaving]     = useState(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    // Cargar categorías
    fetch(`${API_BASE}/categorias-lista`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : []).then(setCategorias).catch(() => {})
    // Cargar proveedores
    fetch(`${API_BASE}/proveedores`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : []).then(setProveedores).catch(() => {})

    if (isEdit) {
      getProducto(id)
        .then(({ producto }) => {
          setForm({
            nombre:         producto.nombre ?? '',
            id_categoria:   producto.id_categoria ?? '',
            id_proveedor:   producto.id_proveedor ?? '',
            descripcion:    producto.descripcion ?? '',
            unidad_medida:  producto.unidad_medida ?? '',
            precio_costo:   producto.precio_costo ?? '',
            precio_venta:   producto.precio_venta ?? '',
            stock_minimo:   producto.stock_minimo ?? '0',
            codigo_barras:  producto.codigo_barras ?? '',
            codigo_interno: producto.codigo_interno ?? '',
            activo:         !!producto.activo,
          })
        })
        .catch(() => setServerError('Error al cargar producto'))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    setErrors((p) => ({ ...p, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es requerido'
    if (!form.id_categoria)  newErrors.id_categoria = 'La categoría es requerida'
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }

    setSaving(true)
    setServerError('')
    try {
      const payload = {
        ...form,
        precio_costo:  form.precio_costo  !== '' ? parseFloat(form.precio_costo) : null,
        precio_venta:  form.precio_venta  !== '' ? parseFloat(form.precio_venta) : null,
        stock_minimo:  parseInt(form.stock_minimo) || 0,
        id_proveedor:  form.id_proveedor  || null,
        codigo_barras: form.codigo_barras  || null,
        codigo_interno:form.codigo_interno || null,
      }
      if (isEdit) await updateProducto(id, payload)
      else await createProducto(payload)
      navigate('/productos')
    } catch (err) {
      if (err?.errors) {
        const mapped = {}
        Object.entries(err.errors).forEach(([k, v]) => { mapped[k] = Array.isArray(v) ? v[0] : v })
        setErrors(mapped)
      } else {
        setServerError(err?.message || 'Error al guardar')
      }
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  const inp = (name, label, type = 'text', extra = {}) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <input
        id={`pf-${name}`} name={name} type={type} value={form[name]} onChange={handleChange} {...extra}
        className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none transition-colors ${
          errors[name] ? 'border-red-400' : 'border-gray-200 focus:border-[#1B4332]'}`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/productos" className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {isEdit ? 'Editar producto' : 'Nuevo producto'}
          </h1>
          <p className="text-gray-500 text-sm">Completa los datos del producto</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {serverError && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {inp('nombre', 'Nombre *')}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Categoría *</label>
              <select
                id="pf-categoria" name="id_categoria" value={form.id_categoria} onChange={handleChange}
                className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none transition-colors bg-white ${
                  errors.id_categoria ? 'border-red-400' : 'border-gray-200 focus:border-[#1B4332]'}`}
              >
                <option value="">Seleccionar...</option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                ))}
              </select>
              {errors.id_categoria && <p className="text-red-500 text-xs mt-1">{errors.id_categoria}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Proveedor</label>
              <select
                name="id_proveedor" value={form.id_proveedor} onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] bg-white"
              >
                <option value="">Sin proveedor</option>
                {proveedores.map?.((p) => (
                  <option key={p.id_proveedor} value={p.id_proveedor}>{p.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descripción</label>
            <textarea
              name="descripcion" value={form.descripcion} onChange={handleChange} rows={3}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {inp('precio_costo',  'Precio costo (Bs)',  'number', { min: 0, step: '0.01' })}
            {inp('precio_venta',  'Precio venta (Bs)',  'number', { min: 0, step: '0.01' })}
            {inp('stock_minimo',  'Stock mínimo',       'number', { min: 0 })}
            {inp('unidad_medida', 'Unidad de medida',   'text',   { placeholder: 'ej. unidad, kg, litro' })}
            {inp('codigo_barras', 'Código de barras')}
            {inp('codigo_interno','Código interno')}
          </div>

          {isEdit && (
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} className="w-4 h-4 rounded accent-[#1B4332]" />
              <span className="text-sm font-medium text-gray-700">Producto activo</span>
            </label>
          )}

          <div className="flex gap-3 pt-2">
            <Link to="/productos" className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-semibold text-sm rounded-xl text-center hover:bg-gray-50 transition-colors">
              Cancelar
            </Link>
            <button
              type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1B4332] text-white font-bold text-sm rounded-xl hover:bg-[#163829] disabled:opacity-60 transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
