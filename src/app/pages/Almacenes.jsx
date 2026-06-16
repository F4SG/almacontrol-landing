import { useEffect, useState } from 'react'
import { getAlmacenes, createAlmacen, deleteAlmacen, getUbicaciones, createUbicacion, deleteUbicacion } from '../services/api'
import Spinner from '../components/Spinner'
import { Plus, Warehouse, Trash2, AlertTriangle, X, Map, MapPin } from 'lucide-react'

// ── Modal Nuevo Almacén ───────────────────────────────────────────────────────
function NuevoAlmacenModal({ onClose, onSaved }) {
  const [form, setForm]   = useState({ nombre: '', direccion: '', responsable: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim()) { setErrors({ nombre: 'El nombre es requerido' }); return }
    setSaving(true)
    try {
      await createAlmacen({ ...form, id_empresa: null })
      onSaved()
    } catch (err) {
      setErrors(err?.errors ?? { nombre: err?.message ?? 'Error al guardar' })
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900 text-lg">Nuevo almacén</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[['nombre','Nombre *'],['direccion','Dirección'],['responsable','Responsable']].map(([k, l]) => (
            <div key={k}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{l}</label>
              <input
                name={k} value={form[k]} onChange={e => { setForm(p=>({...p,[k]:e.target.value})); setErrors(p=>({...p,[k]:''})) }}
                className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none transition-colors ${errors[k]?'border-red-400':'border-gray-200 focus:border-[#1B4332]'}`}
              />
              {errors[k] && <p className="text-red-500 text-xs mt-1">{errors[k]}</p>}
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-[#1B4332] text-white font-bold text-sm rounded-xl hover:bg-[#163829] disabled:opacity-60">
              {saving ? 'Guardando...' : 'Crear almacén'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Modal Mapa del Almacén ────────────────────────────────────────────────────
function MapaModal({ almacen, onClose }) {
  const [ubicaciones, setUbicaciones] = useState([])
  const [loading, setLoading]         = useState(true)
  const [form, setForm]               = useState({ pasillo: '', estante: '', nivel: '', capacidad_max: '' })
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')
  const [deleting, setDeleting]       = useState(null)

  const fetchUbicaciones = () => {
    setLoading(true)
    getUbicaciones(almacen.id_almacen).then(setUbicaciones).finally(() => setLoading(false))
  }

  useEffect(() => { fetchUbicaciones() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.pasillo || !form.estante || !form.nivel) {
      setError('Pasillo, estante y nivel son requeridos')
      return
    }
    setSaving(true)
    setError('')
    try {
      await createUbicacion(almacen.id_almacen, {
        pasillo: form.pasillo,
        estante: form.estante,
        nivel:   form.nivel,
        capacidad_max: form.capacidad_max ? parseInt(form.capacidad_max) : null,
      })
      setForm({ pasillo: '', estante: '', nivel: '', capacidad_max: '' })
      fetchUbicaciones()
    } catch (err) {
      setError(err?.message || 'Error al crear ubicación')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta ubicación?')) return
    setDeleting(id)
    try { await deleteUbicacion(id); fetchUbicaciones() }
    catch {} finally { setDeleting(null) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
              <Map className="w-5 h-5 text-[#1B4332]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Mapa del almacén</h3>
              <p className="text-xs text-gray-400">{almacen.nombre}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Formulario agregar ubicación */}
          <form onSubmit={handleAdd} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Agregar ubicación</p>
            {error && <p className="text-red-600 text-xs mb-3">{error}</p>}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {[['pasillo','Pasillo'], ['estante','Estante'], ['nivel','Nivel']].map(([k, l]) => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{l} *</label>
                  <input
                    value={form[k]}
                    onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                    placeholder={l}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B4332]"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Capacidad</label>
                <input
                  type="number" min="0"
                  value={form.capacidad_max}
                  onChange={e => setForm(p => ({ ...p, capacidad_max: e.target.value }))}
                  placeholder="Opcional"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B4332]"
                />
              </div>
            </div>
            <button
              type="submit" disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B4332] text-white font-semibold text-sm rounded-xl hover:bg-[#163829] disabled:opacity-60"
            >
              <Plus className="w-4 h-4" /> {saving ? 'Guardando...' : 'Agregar ubicación'}
            </button>
          </form>

          {/* Lista de ubicaciones */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1B4332]" />
              Ubicaciones registradas ({ubicaciones.length})
            </p>
            {loading ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : ubicaciones.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Map className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Sin ubicaciones registradas</p>
                <p className="text-xs mt-1">Agrega pasillos, estantes y niveles para organizar tu almacén</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-2">
                {ubicaciones.map(u => (
                  <div key={u.id_ubicacion} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-green-200 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#1B4332]/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-[#1B4332]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Pasillo {u.pasillo} — {u.estante} — Nivel {u.nivel}
                        </p>
                        {u.capacidad_max && (
                          <p className="text-xs text-gray-400">Cap. máx: {u.capacidad_max} unid.</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(u.id_ubicacion)}
                      disabled={deleting === u.id_ubicacion}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Página Almacenes ──────────────────────────────────────────────────────────
export default function Almacenes() {
  const [almacenes, setAlmacenes]   = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [showModal, setShowModal]   = useState(false)
  const [mapaAlmacen, setMapaAlmacen] = useState(null) // almacen seleccionado para ver mapa
  const [deleting, setDeleting]     = useState(null)

  const fetchData = () => {
    setLoading(true)
    getAlmacenes()
      .then(setAlmacenes)
      .catch(err => setError(err?.message || 'Error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('¿Desactivar este almacén?')) return
    setDeleting(id)
    try { await deleteAlmacen(id); fetchData() } catch { alert('Error') } finally { setDeleting(null) }
  }

  if (loading && !almacenes.length) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
  if (error) return <div className="flex gap-3 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-700"><AlertTriangle className="w-5 h-5" /><p>{error}</p></div>

  return (
    <div className="space-y-5">
      {showModal && <NuevoAlmacenModal onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); fetchData() }} />}
      {mapaAlmacen && <MapaModal almacen={mapaAlmacen} onClose={() => setMapaAlmacen(null)} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Almacenes</h1>
          <p className="text-gray-500 text-sm mt-0.5">{almacenes.length} almacenes activos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B4332] text-white font-semibold text-sm rounded-xl hover:bg-[#163829] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo almacén
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {almacenes.map((a) => (
          <div key={a.id_almacen} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Warehouse className="w-5 h-5 text-[#1B4332]" />
              </div>
              <button
                onClick={() => handleDelete(a.id_almacen)}
                disabled={deleting === a.id_almacen}
                className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-bold text-gray-900 mt-3">{a.nombre}</h3>
            {a.direccion && <p className="text-gray-500 text-sm mt-0.5 truncate">{a.direccion}</p>}
            {a.responsable && (
              <p className="text-xs text-gray-400 mt-2">Responsable: <span className="font-medium text-gray-600">{a.responsable}</span></p>
            )}
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                Activo
              </span>
              <button
                onClick={() => setMapaAlmacen(a)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1B4332] bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <Map className="w-3.5 h-3.5" /> Ver mapa
              </button>
            </div>
          </div>
        ))}

        {almacenes.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-400">
            <Warehouse className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No hay almacenes registrados</p>
          </div>
        )}
      </div>
    </div>
  )
}
