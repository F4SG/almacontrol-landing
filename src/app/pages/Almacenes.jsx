import { useEffect, useState, useCallback } from 'react'
import {
  getAlmacenes, createAlmacen, deleteAlmacen,
  getUbicaciones, createUbicacion, deleteUbicacion,
  getMapaAlmacen,
} from '../services/api'
import Spinner from '../components/Spinner'
import {
  Plus, Warehouse, Trash2, AlertTriangle, X,
  Map, MapPin, Package, ChevronRight, Eye, Grid3x3,
} from 'lucide-react'

// ── Helpers ──────────────────────────────────────────────────────────────────
const stockColor = (cantidad, minimo) => {
  if (cantidad === 0)         return { bg: 'bg-red-500',    border: 'border-red-600',    text: 'text-white', label: 'Sin stock' }
  if (cantidad <= minimo)     return { bg: 'bg-orange-400', border: 'border-orange-500', text: 'text-white', label: 'Bajo' }
  return                             { bg: 'bg-emerald-500', border: 'border-emerald-600', text: 'text-white', label: 'OK' }
}
const emptyColor = { bg: 'bg-gray-100', border: 'border-gray-200', text: 'text-gray-400', label: 'Vacío' }

// ── Mapa Visual ───────────────────────────────────────────────────────────────
function MapaVisual({ almacenId, almacenNombre, highlightProductoId }) {
  const [mapaData, setMapaData]       = useState(null)
  const [loading, setLoading]         = useState(true)
  const [selected, setSelected]       = useState(null) // { pasillo, estante }
  const [view, setView]               = useState('mapa') // 'mapa' | 'lista'

  useEffect(() => {
    setLoading(true)
    getMapaAlmacen(almacenId).then(setMapaData).finally(() => setLoading(false))
  }, [almacenId])

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>

  const { ubicaciones = [], inventario = [] } = mapaData ?? {}

  // Construir la grilla a partir de ubicaciones
  const pasillos = [...new Set(ubicaciones.map(u => u.pasillo))].sort()
  const estantes  = [...new Set(ubicaciones.map(u => u.estante))].sort()

  // Estado total del inventario en este almacen
  const totalProductos = inventario.length
  const sinStock       = inventario.filter(i => i.cantidad === 0).length
  const stockBajo      = inventario.filter(i => i.cantidad > 0 && i.cantidad <= i.stock_minimo).length

  const selectedProducts = selected
    ? inventario // cuando hay grid sin link a ubicacion, mostramos todo
    : []

  return (
    <div className="space-y-4">
      {/* Stats rápidos */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-gray-900">{totalProductos}</p>
          <p className="text-xs text-gray-500">Productos</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-orange-500">{stockBajo}</p>
          <p className="text-xs text-gray-500">Stock bajo</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-red-500">{sinStock}</p>
          <p className="text-xs text-gray-500">Sin stock</p>
        </div>
      </div>

      {/* Toggle vista */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('mapa')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${view === 'mapa' ? 'bg-[#1B4332] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          <Grid3x3 className="w-4 h-4" /> Mapa visual
        </button>
        <button
          onClick={() => setView('lista')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${view === 'lista' ? 'bg-[#1B4332] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          <Package className="w-4 h-4" /> Lista de stock
        </button>
      </div>

      {view === 'mapa' && (
        <>
          {ubicaciones.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 py-12 text-center">
              <MapPin className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-semibold text-gray-500">Sin ubicaciones definidas</p>
              <p className="text-xs text-gray-400 mt-1">Agrega pasillos y estantes para ver el mapa visual</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Leyenda */}
              <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 bg-gray-50 text-xs">
                <span className="font-semibold text-gray-500">Leyenda:</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Normal</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-400 inline-block" /> Bajo mínimo</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500 inline-block" /> Sin stock</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100 border border-gray-200 inline-block" /> Vacío</span>
              </div>

              {/* Mapa de grilla */}
              <div className="p-4 overflow-x-auto">
                <div
                  className="grid gap-2 w-max min-w-full"
                  style={{ gridTemplateColumns: `56px repeat(${pasillos.length}, minmax(72px, 1fr))` }}
                >
                  {/* Header: pasillos */}
                  <div />
                  {pasillos.map(p => (
                    <div key={p} className="text-center text-xs font-bold text-gray-500 py-1">
                      Pasillo {p}
                    </div>
                  ))}

                  {/* Filas: estantes */}
                  {estantes.map(estante => (
                    <>
                      {/* Label estante */}
                      <div key={`label-${estante}`} className="flex items-center justify-end pr-2">
                        <span className="text-xs font-bold text-gray-500">Est. {estante}</span>
                      </div>
                      {/* Celdas de pasillos */}
                      {pasillos.map(pasillo => {
                        const ub = ubicaciones.find(u => u.pasillo === pasillo && u.estante === estante)
                        if (!ub) {
                          return (
                            <div key={`${pasillo}-${estante}`}
                              className="h-16 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center"
                            >
                              <span className="text-gray-300 text-xs">—</span>
                            </div>
                          )
                        }

                        // Para esta ubicación, mostramos el inventario del almacén (sin link directo)
                        // En el futuro, si hay link por id_ubicacion, se filtraría aquí
                        const highlight = highlightProductoId && inventario.some(i => i.id_producto === highlightProductoId)
                        const colors    = inventario.length > 0 ? stockColor(
                          inventario.reduce((s, i) => s + i.cantidad, 0) / inventario.length,
                          inventario.reduce((s, i) => s + i.stock_minimo, 0) / inventario.length
                        ) : emptyColor

                        const isSelected = selected?.pasillo === pasillo && selected?.estante === estante

                        return (
                          <button
                            key={`${pasillo}-${estante}`}
                            onClick={() => setSelected(isSelected ? null : { pasillo, estante })}
                            className={`h-16 rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 transition-all duration-200 text-white
                              ${highlight ? 'ring-4 ring-[#F59E0B] ring-offset-1 scale-105 shadow-lg' : ''}
                              ${isSelected ? 'ring-2 ring-[#1B4332] ring-offset-1 scale-105 shadow-lg' : 'hover:scale-102 hover:shadow-md'}
                              ${colors.bg} ${colors.border}`}
                          >
                            <MapPin className="w-4 h-4" />
                            <span className="text-[10px] font-bold">
                              P{pasillo} E{estante}
                            </span>
                            {ub.capacidad_max && (
                              <span className="text-[9px] opacity-75">Cap: {ub.capacidad_max}</span>
                            )}
                          </button>
                        )
                      })}
                    </>
                  ))}
                </div>
              </div>

              {/* Panel detalle cuando se selecciona una celda */}
              {selected && (
                <div className="border-t border-gray-100 bg-green-50 px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-gray-900 text-sm">
                      📍 Pasillo {selected.pasillo} — Estante {selected.estante}
                    </p>
                    <button onClick={() => setSelected(null)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {inventario.length === 0 ? (
                    <p className="text-gray-500 text-sm">No hay productos en este almacén</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {inventario.map((item, i) => {
                        const colors = stockColor(item.cantidad, item.stock_minimo)
                        return (
                          <div key={i} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-gray-100 shadow-sm">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{item.nombre}</p>
                              <p className="text-xs text-gray-400">{item.categoria}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
                              {item.cantidad} unid.
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {view === 'lista' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {inventario.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No hay stock registrado en este almacén</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Producto</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Cantidad</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {inventario.map((item, i) => {
                  const colors = stockColor(item.cantidad, item.stock_minimo)
                  return (
                    <tr key={i} className={`hover:bg-gray-50 ${highlightProductoId === item.id_producto ? 'bg-amber-50' : ''}`}>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-gray-900">{item.nombre}</p>
                        <p className="text-xs text-gray-400">{item.categoria}</p>
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-gray-900">{item.cantidad}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
                          {colors.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}

// ── Modal Nuevo Almacén ───────────────────────────────────────────────────────
function NuevoAlmacenModal({ onClose, onSaved }) {
  const [form, setForm]     = useState({ nombre: '', direccion: '', responsable: '' })
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
                value={form[k]}
                onChange={e => { setForm(p=>({...p,[k]:e.target.value})); setErrors(p=>({...p,[k]:''})) }}
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

// ── Modal Gestión de Ubicaciones ──────────────────────────────────────────────
function UbicacionesModal({ almacen, onClose }) {
  const [ubicaciones, setUbicaciones] = useState([])
  const [loading, setLoading]         = useState(true)
  const [form, setForm]               = useState({ pasillo: '', estante: '', nivel: '1', capacidad_max: '' })
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')
  const [deleting, setDeleting]       = useState(null)

  const fetch_ = () => {
    setLoading(true)
    getUbicaciones(almacen.id_almacen).then(setUbicaciones).finally(() => setLoading(false))
  }

  useEffect(() => { fetch_() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.pasillo || !form.estante || !form.nivel) { setError('Pasillo, estante y nivel son requeridos'); return }
    setSaving(true); setError('')
    try {
      await createUbicacion(almacen.id_almacen, {
        pasillo: form.pasillo, estante: form.estante, nivel: form.nivel,
        capacidad_max: form.capacidad_max ? parseInt(form.capacidad_max) : null,
      })
      setForm({ pasillo: '', estante: '', nivel: '1', capacidad_max: '' })
      fetch_()
    } catch (err) { setError(err?.message || 'Error al crear') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta ubicación?')) return
    setDeleting(id)
    try { await deleteUbicacion(id); fetch_() } catch {} finally { setDeleting(null) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900">Gestionar ubicaciones</h3>
            <p className="text-xs text-gray-400">{almacen.nombre}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <form onSubmit={handleAdd} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Agregar ubicación</p>
            {error && <p className="text-red-600 text-xs mb-3">{error}</p>}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {[['pasillo','Pasillo'], ['estante','Estante'], ['nivel','Nivel']].map(([k, l]) => (
                <div key={k}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">{l} *</label>
                  <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))}
                    placeholder={l}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B4332]" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Capacidad</label>
                <input type="number" min="0" value={form.capacidad_max}
                  onChange={e => setForm(p => ({ ...p, capacidad_max: e.target.value }))}
                  placeholder="Opcional"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B4332]" />
              </div>
            </div>
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1B4332] text-white font-semibold text-sm rounded-xl hover:bg-[#163829] disabled:opacity-60">
              <Plus className="w-4 h-4" /> {saving ? 'Guardando...' : 'Agregar'}
            </button>
          </form>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Ubicaciones ({ubicaciones.length})</p>
            {loading ? <div className="flex justify-center py-6"><Spinner /></div> : ubicaciones.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">Sin ubicaciones — agrega una arriba</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-2">
                {ubicaciones.map(u => (
                  <div key={u.id_ubicacion} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#1B4332]" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">P{u.pasillo} — E{u.estante} — N{u.nivel}</p>
                        {u.capacidad_max && <p className="text-xs text-gray-400">Cap: {u.capacidad_max}</p>}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(u.id_ubicacion)} disabled={deleting === u.id_ubicacion}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-40">
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

// ── Página Principal Almacenes ────────────────────────────────────────────────
export default function Almacenes() {
  const [almacenes, setAlmacenes]         = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [showNuevo, setShowNuevo]         = useState(false)
  const [mapaAlmacen, setMapaAlmacen]     = useState(null)  // almacén seleccionado para mapa
  const [ubicAlmacen, setUbicAlmacen]     = useState(null)  // almacén para gestión de ubicaciones
  const [deleting, setDeleting]           = useState(null)

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
      {showNuevo    && <NuevoAlmacenModal onClose={() => setShowNuevo(false)} onSaved={() => { setShowNuevo(false); fetchData() }} />}
      {ubicAlmacen  && <UbicacionesModal almacen={ubicAlmacen} onClose={() => setUbicAlmacen(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Almacenes</h1>
          <p className="text-gray-500 text-sm mt-0.5">{almacenes.length} almacenes activos</p>
        </div>
        <button onClick={() => setShowNuevo(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B4332] text-white font-semibold text-sm rounded-xl hover:bg-[#163829] transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Nuevo almacén
        </button>
      </div>

      {/* Tarjetas de almacenes */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {almacenes.map((a) => (
          <div key={a.id_almacen}
            className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-200 overflow-hidden ${mapaAlmacen?.id_almacen === a.id_almacen ? 'border-[#1B4332] shadow-lg' : 'border-gray-100 hover:shadow-md'}`}
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Warehouse className="w-5 h-5 text-[#1B4332]" />
                </div>
                <button onClick={() => handleDelete(a.id_almacen)} disabled={deleting === a.id_almacen}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-40">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-bold text-gray-900 mt-3">{a.nombre}</h3>
              {a.direccion && <p className="text-gray-500 text-sm mt-0.5 truncate">{a.direccion}</p>}
              {a.responsable && <p className="text-xs text-gray-400 mt-1">Resp: <span className="font-medium text-gray-600">{a.responsable}</span></p>}
            </div>
            <div className="flex border-t border-gray-100 divide-x divide-gray-100">
              <button
                onClick={() => setMapaAlmacen(mapaAlmacen?.id_almacen === a.id_almacen ? null : a)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-[#1B4332] hover:bg-green-50 transition-colors"
              >
                <Map className="w-3.5 h-3.5" />
                {mapaAlmacen?.id_almacen === a.id_almacen ? 'Ocultar mapa' : 'Ver mapa'}
              </button>
              <button
                onClick={() => setUbicAlmacen(a)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" /> Ubicaciones
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

      {/* Mapa expandido del almacén seleccionado */}
      {mapaAlmacen && (
        <div className="bg-gray-50 rounded-2xl border-2 border-[#1B4332]/20 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-[#1B4332] rounded-lg flex items-center justify-center">
              <Map className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Mapa — {mapaAlmacen.nombre}</h2>
              <p className="text-xs text-gray-400">Vista de distribución y stock</p>
            </div>
            <button onClick={() => setMapaAlmacen(null)} className="ml-auto p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
              <X className="w-4 h-4" />
            </button>
          </div>
          <MapaVisual almacenId={mapaAlmacen.id_almacen} almacenNombre={mapaAlmacen.nombre} />
        </div>
      )}
    </div>
  )
}
