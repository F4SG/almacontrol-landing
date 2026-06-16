import { useEffect, useState } from 'react'
import { getInventario, getProductos, getAlmacenes, registrarEntrada, registrarSalida } from '../services/api'
import Spinner from '../components/Spinner'
import { ArrowDownCircle, ArrowUpCircle, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'

export default function Inventario() {
  const [inventario, setInventario] = useState([])
  const [productos,  setProductos]  = useState([])
  const [almacenes,  setAlmacenes]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [feedback,   setFeedback]   = useState(null) // { type: 'success'|'error', msg }

  const [form, setForm] = useState({
    id_producto: '', id_almacen: '', cantidad: '', observaciones: '',
  })

  const fetchInventario = () => {
    setLoading(true)
    getInventario()
      .then(setInventario)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchInventario()
    getProductos().then(d => setProductos(d.data ?? [])).catch(() => {})
    getAlmacenes().then(setAlmacenes).catch(() => {})
  }, [])

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }))
    setFeedback(null)
  }

  const submit = async (tipo) => {
    if (!form.id_producto || !form.id_almacen || !form.cantidad) {
      setFeedback({ type: 'error', msg: 'Completa producto, almacén y cantidad' })
      return
    }
    setFormLoading(true)
    setFeedback(null)
    try {
      const fn = tipo === 'ENTRADA' ? registrarEntrada : registrarSalida
      await fn({
        id_producto:   parseInt(form.id_producto),
        id_almacen:    parseInt(form.id_almacen),
        cantidad:      parseInt(form.cantidad),
        observaciones: form.observaciones || null,
      })
      setFeedback({ type: 'success', msg: `${tipo === 'ENTRADA' ? 'Entrada' : 'Salida'} registrada correctamente` })
      setForm({ id_producto: '', id_almacen: '', cantidad: '', observaciones: '' })
      fetchInventario()
    } catch (err) {
      setFeedback({ type: 'error', msg: err?.message || 'Error al registrar' })
    } finally { setFormLoading(false) }
  }

  const getStockStatus = (inv) => {
    if (!inv.producto) return 'normal'
    if (inv.cantidad === 0) return 'cero'
    if (inv.cantidad <= (inv.producto.stock_minimo ?? 0)) return 'bajo'
    return 'normal'
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Inventario</h1>
        <p className="text-gray-500 text-sm mt-0.5">Stock actual y registro de movimientos</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Stock table (left — 3/5) */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Stock actual</h2>
            <button
              onClick={fetchInventario}
              className="p-1.5 rounded-lg text-gray-400 hover:text-[#1B4332] hover:bg-green-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48"><Spinner /></div>
          ) : inventario.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No hay registros de inventario</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Producto</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Almacén</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Cantidad</th>
                    <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {inventario.map((inv) => {
                    const status = getStockStatus(inv)
                    return (
                      <tr key={inv.id_inventario} className="hover:bg-gray-50">
                        <td className="px-5 py-3.5 font-medium text-gray-900">{inv.producto?.nombre ?? '—'}</td>
                        <td className="px-5 py-3.5 text-gray-600">{inv.almacen?.nombre ?? '—'}</td>
                        <td className="px-5 py-3.5 text-right">
                          <span className={`font-bold text-base ${
                            status === 'cero' ? 'text-red-600' :
                            status === 'bajo' ? 'text-orange-500' : 'text-green-700'
                          }`}>{inv.cantidad}</span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            status === 'cero' ? 'bg-red-100 text-red-700' :
                            status === 'bajo' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {status === 'cero' ? 'Sin stock' : status === 'bajo' ? 'Stock bajo' : 'Normal'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Form (right — 2/5) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-fit">
          <h2 className="font-bold text-gray-900 mb-4">Registrar movimiento</h2>

          {feedback && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium mb-4 ${
              feedback.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {feedback.type === 'success'
                ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
              {feedback.msg}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Producto</label>
              <select
                name="id_producto" value={form.id_producto} onChange={handleChange}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] bg-white"
              >
                <option value="">Seleccionar producto...</option>
                {productos.map(p => (
                  <option key={p.id_producto} value={p.id_producto}>{p.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Almacén</label>
              <select
                name="id_almacen" value={form.id_almacen} onChange={handleChange}
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] bg-white"
              >
                <option value="">Seleccionar almacén...</option>
                {almacenes.map(a => (
                  <option key={a.id_almacen} value={a.id_almacen}>{a.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cantidad</label>
              <input
                name="cantidad" type="number" min="1" value={form.cantidad} onChange={handleChange}
                placeholder="0"
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Observaciones</label>
              <textarea
                name="observaciones" value={form.observaciones} onChange={handleChange}
                rows={2} placeholder="Opcional..."
                className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] resize-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                id="btn-entrada"
                onClick={() => submit('ENTRADA')}
                disabled={formLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1B4332] text-white font-bold text-sm rounded-xl hover:bg-[#163829] disabled:opacity-60 transition-colors"
              >
                <ArrowDownCircle className="w-4 h-4" />
                Entrada
              </button>
              <button
                id="btn-salida"
                onClick={() => submit('SALIDA')}
                disabled={formLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                <ArrowUpCircle className="w-4 h-4" />
                Salida
              </button>
            </div>
            {formLoading && <div className="flex justify-center"><Spinner size="sm" /></div>}
          </div>
        </div>
      </div>
    </div>
  )
}
