import { useEffect, useState } from 'react'
import { getAlmacenes, createAlmacen, deleteAlmacen } from '../services/api'
import Spinner from '../components/Spinner'
import { Plus, Warehouse, Trash2, AlertTriangle, X } from 'lucide-react'

function Modal({ onClose, onSaved }) {
  const [form, setForm]   = useState({ id_empresa: '', nombre: '', direccion: '', responsable: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim()) { setErrors({ nombre: 'El nombre es requerido' }); return }
    setSaving(true)
    try {
      await createAlmacen({ ...form, id_empresa: form.id_empresa || null })
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

export default function Almacenes() {
  const [almacenes, setAlmacenes] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState(null)

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
      {showModal && <Modal onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); fetchData() }} />}

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
            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                Activo
              </span>
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
