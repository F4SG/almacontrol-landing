import { useEffect, useState } from 'react'
import { getOrdenes, createOrden, cambiarEstadoOrden, getAlmacenes, getProductos } from '../services/api'
import Spinner from '../components/Spinner'
import { Plus, ShoppingCart, ChevronLeft, ChevronRight, CheckCircle, XCircle, X } from 'lucide-react'

const TIPO_ORDEN = [
  { id: 1, nombre: 'COMPRA' }, { id: 2, nombre: 'VENTA' }, { id: 3, nombre: 'TRANSFERENCIA' },
  { id: 4, nombre: 'AJUSTE' }, { id: 5, nombre: 'DEVOLUCION' },
]

const estadoColors = {
  PENDIENTE: 'bg-yellow-100 text-yellow-700',
  PROCESADA: 'bg-green-100 text-green-700',
  ANULADA:   'bg-red-100 text-red-700',
}

function NuevaOrdenModal({ onClose, onCreated }) {
  const [almacenes, setAlmacenes] = useState([])
  const [productos, setProductos] = useState([])
  const [form, setForm] = useState({ id_tipo_orden: '', id_almacen_origen: '', observaciones: '' })
  const [detalles, setDetalles] = useState([{ id_producto: '', cantidad: 1, precio_unitario: 0 }])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getAlmacenes().then(setAlmacenes).catch(() => {})
    getProductos().then(d => setProductos(d.data ?? [])).catch(() => {})
  }, [])

  const addDetalle = () => setDetalles(d => [...d, { id_producto: '', cantidad: 1, precio_unitario: 0 }])
  const removeDetalle = (i) => setDetalles(d => d.filter((_, idx) => idx !== i))
  const updateDetalle = (i, k, v) => setDetalles(d => d.map((item, idx) => idx === i ? { ...item, [k]: v } : item))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.id_tipo_orden || !form.id_almacen_origen) { setError('Completa tipo de orden y almacén'); return }
    if (detalles.some(d => !d.id_producto)) { setError('Selecciona producto en todos los detalles'); return }
    setSaving(true)
    try {
      await createOrden({
        id_tipo_orden:     parseInt(form.id_tipo_orden),
        id_almacen_origen: parseInt(form.id_almacen_origen),
        observaciones:     form.observaciones || null,
        detalles: detalles.map(d => ({
          id_producto:    parseInt(d.id_producto),
          cantidad:       parseInt(d.cantidad),
          precio_unitario:parseFloat(d.precio_unitario),
        })),
      })
      onCreated()
    } catch (err) { setError(err?.message || 'Error al crear orden') }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-900 text-lg">Nueva orden</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        {error && <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tipo de orden *</label>
              <select value={form.id_tipo_orden} onChange={e => setForm(p=>({...p, id_tipo_orden:e.target.value}))}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] bg-white">
                <option value="">Seleccionar...</option>
                {TIPO_ORDEN.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Almacén origen *</label>
              <select value={form.id_almacen_origen} onChange={e => setForm(p=>({...p, id_almacen_origen:e.target.value}))}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] bg-white">
                <option value="">Seleccionar...</option>
                {almacenes.map(a => <option key={a.id_almacen} value={a.id_almacen}>{a.nombre}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Observaciones</label>
            <input value={form.observaciones} onChange={e => setForm(p=>({...p,observaciones:e.target.value}))}
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332]" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Detalles</label>
              <button type="button" onClick={addDetalle} className="text-xs text-[#1B4332] font-semibold hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> Agregar
              </button>
            </div>
            {detalles.map((d, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 mb-2">
                <select value={d.id_producto} onChange={e => updateDetalle(i,'id_producto',e.target.value)}
                  className="col-span-6 px-2 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#1B4332] bg-white">
                  <option value="">Producto...</option>
                  {productos.map(p => <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>)}
                </select>
                <input type="number" min="1" value={d.cantidad} onChange={e => updateDetalle(i,'cantidad',e.target.value)}
                  placeholder="Cant."
                  className="col-span-2 px-2 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#1B4332]" />
                <input type="number" min="0" step="0.01" value={d.precio_unitario} onChange={e => updateDetalle(i,'precio_unitario',e.target.value)}
                  placeholder="Precio"
                  className="col-span-3 px-2 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#1B4332]" />
                <button type="button" onClick={() => removeDetalle(i)} className="col-span-1 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-[#1B4332] text-white font-bold text-sm rounded-xl hover:bg-[#163829] disabled:opacity-60">
              {saving ? 'Creando...' : 'Crear orden'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Ordenes() {
  const [data,     setData]     = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [page,     setPage]     = useState(1)
  const [modal,    setModal]    = useState(false)

  const fetchData = (p = 1) => {
    setLoading(true)
    getOrdenes(p).then(setData).finally(() => setLoading(false))
  }

  useEffect(() => { fetchData(page) }, [page])

  const handleEstado = async (id, estado) => {
    if (!window.confirm(`¿Marcar la orden como ${estado}?`)) return
    try { await cambiarEstadoOrden(id, estado); fetchData(page) }
    catch (err) { alert(err?.message || 'Error') }
  }

  const rows = data?.data ?? []

  return (
    <div className="space-y-5">
      {modal && <NuevaOrdenModal onClose={() => setModal(false)} onCreated={() => { setModal(false); fetchData(1) }} />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Órdenes</h1>
          <p className="text-gray-500 text-sm mt-0.5">{data?.total ?? 0} órdenes registradas</p>
        </div>
        <button onClick={() => setModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B4332] text-white font-semibold text-sm rounded-xl hover:bg-[#163829] shadow-sm">
          <Plus className="w-4 h-4" /> Nueva orden
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner /></div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No hay órdenes registradas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Nº Documento</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Almacén</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                  <th className="text-center px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map(o => (
                  <tr key={o.id_orden} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-mono font-semibold text-gray-900 text-xs">{o.numero_documento}</td>
                    <td className="px-5 py-4 text-gray-600">{o.tipo_orden?.nombre ?? '—'}</td>
                    <td className="px-5 py-4 text-gray-600">{o.almacen_origen?.nombre ?? '—'}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(o.fecha_orden).toLocaleDateString('es-BO')}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${estadoColors[o.estado]}`}>
                        {o.estado}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {o.estado === 'PENDIENTE' && (
                        <div className="flex items-center gap-1.5 justify-end">
                          <button onClick={() => handleEstado(o.id_orden, 'PROCESADA')}
                            className="p-1.5 rounded-lg text-green-500 hover:bg-green-50" title="Procesar">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleEstado(o.id_orden, 'ANULADA')}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50" title="Anular">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && data.last_page > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Página {data.current_page} de {data.last_page}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPage(p => Math.min(data.last_page,p+1))} disabled={page===data.last_page}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
