import { useEffect, useState } from 'react'
import {
  getProveedores, createProveedor, updateProveedor, deleteProveedor
} from '../services/api'
import Spinner from '../components/Spinner'
import { Plus, TruckIcon, Trash2, Edit2, AlertTriangle, X, Phone, Mail, MapPin } from 'lucide-react'

// ── Modal Formulario ────────────────────────────────────────────────────────
function ProveedorFormModal({ proveedor, onClose, onSaved }) {
  const isEdit = Boolean(proveedor)
  const [form, setForm] = useState({
    nombre: '', contacto: '', telefono: '', email: '', direccion: ''
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (proveedor) {
      setForm({
        nombre: proveedor.nombre || '',
        contacto: proveedor.contacto || '',
        telefono: proveedor.telefono || '',
        email: proveedor.email || '',
        direccion: proveedor.direccion || ''
      })
    }
  }, [proveedor])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.nombre.trim()) {
      setErrors({ nombre: 'El nombre de la empresa es requerido' })
      return
    }
    
    setSaving(true)
    try {
      if (isEdit) {
        await updateProveedor(proveedor.id_proveedor, form)
      } else {
        await createProveedor(form)
      }
      onSaved()
    } catch (err) {
      setErrors(err?.errors || { general: err?.message || 'Error al guardar el proveedor' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900 text-lg">
            {isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre (Empresa) *</label>
            <input
              value={form.nombre}
              onChange={e => { setForm(p => ({ ...p, nombre: e.target.value })); setErrors(p => ({ ...p, nombre: '' })) }}
              className={`w-full px-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none transition-colors ${errors.nombre ? 'border-red-400' : 'border-gray-200 focus:border-[#1B4332]'}`}
            />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Contacto</label>
            <input
              value={form.contacto}
              onChange={e => setForm(p => ({ ...p, contacto: e.target.value }))}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
              <input
                value={form.telefono}
                onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección</label>
            <input
              value={form.direccion}
              onChange={e => setForm(p => ({ ...p, direccion: e.target.value }))}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-[#1B4332] text-white font-bold text-sm rounded-xl hover:bg-[#163829] disabled:opacity-60 transition-colors"
            >
              {saving ? 'Guardando...' : 'Guardar Proveedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Página Principal Proveedores ──────────────────────────────────────────────
export default function Proveedores() {
  const [proveedores, setProveedores]     = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [showModal, setShowModal]         = useState(false)
  const [editingProv, setEditingProv]     = useState(null)
  const [deleting, setDeleting]           = useState(null)

  const fetchData = () => {
    setLoading(true)
    getProveedores()
      .then(setProveedores)
      .catch(err => setError(err?.message || 'Error al cargar proveedores'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('¿Desactivar/Eliminar este proveedor?')) return
    setDeleting(id)
    try {
      await deleteProveedor(id)
      fetchData()
    } catch (err) {
      alert(err?.message || 'Error al eliminar proveedor')
    } finally {
      setDeleting(null)
    }
  }

  const openNew = () => {
    setEditingProv(null)
    setShowModal(true)
  }

  const openEdit = (prov) => {
    setEditingProv(prov)
    setShowModal(true)
  }

  if (loading && !proveedores.length) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
  if (error) return <div className="flex gap-3 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-700"><AlertTriangle className="w-5 h-5" /><p>{error}</p></div>

  return (
    <div className="space-y-5">
      {showModal && (
        <ProveedorFormModal
          proveedor={editingProv}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false)
            fetchData()
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Proveedores</h1>
          <p className="text-gray-500 text-sm mt-0.5">{proveedores.length} proveedores registrados</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B4332] text-white font-semibold text-sm rounded-xl hover:bg-[#163829] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo proveedor
        </button>
      </div>

      {/* Tarjetas de proveedores */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {proveedores.map((p) => (
          <div key={p.id_proveedor} className="bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TruckIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#1B4332] hover:bg-green-50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id_proveedor)}
                    disabled={deleting === p.id_proveedor}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="font-bold text-gray-900 mb-1">{p.nombre}</h3>
              
              {p.contacto && (
                <p className="text-sm font-medium text-gray-600 mb-3">{p.contacto}</p>
              )}
              
              <div className="space-y-2 mt-4">
                {p.telefono && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{p.telefono}</span>
                  </div>
                )}
                {p.email && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{p.email}</span>
                  </div>
                )}
                {p.direccion && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{p.direccion}</span>
                  </div>
                )}
                {!p.telefono && !p.email && !p.direccion && (
                  <p className="text-xs text-gray-400 italic">Sin datos de contacto</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {proveedores.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-400">
            <TruckIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No hay proveedores registrados</p>
          </div>
        )}
      </div>
    </div>
  )
}
