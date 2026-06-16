import { useEffect, useState } from 'react'
import { getAlertas, marcarAlertaLeida, marcarTodasLeidas, createOrden, getAlmacenes } from '../services/api'
import Spinner from '../components/Spinner'
import { Bell, BellOff, CheckCheck, AlertTriangle, Package, Warehouse, ShoppingCart, X } from 'lucide-react'

const tipoColors = {
  STOCK_MINIMO:       'border-l-orange-400 bg-orange-50',
  STOCK_CERO:         'border-l-red-500 bg-red-50',
  VENCIMIENTO_PROXIMO:'border-l-yellow-400 bg-yellow-50',
}

const tipoIconColors = {
  STOCK_MINIMO:       'text-orange-500',
  STOCK_CERO:         'text-red-600',
  VENCIMIENTO_PROXIMO:'text-yellow-600',
}

// ── Mini-modal Orden de Reposición ────────────────────────────────────────────
function ReposicionModal({ alerta, onClose, onCreated }) {
  const [almacenes, setAlmacenes] = useState([])
  const [form, setForm]           = useState({ id_almacen: '', cantidad: 1 })
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    getAlmacenes().then(setAlmacenes).catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.id_almacen || !form.cantidad || form.cantidad < 1) {
      setError('Selecciona almacén e ingresa una cantidad válida')
      return
    }
    setSaving(true)
    setError('')
    try {
      await createOrden({
        id_tipo_orden:     1, // COMPRA
        id_almacen_origen: parseInt(form.id_almacen),
        observaciones:     `Reposición automática por alerta: ${alerta.mensaje}`,
        detalles: [{
          id_producto:     alerta.id_producto,
          cantidad:        parseInt(form.cantidad),
          precio_unitario: 0,
        }],
      })
      onCreated()
    } catch (err) {
      setError(err?.message || 'Error al crear la orden')
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-gray-900">Orden de reposición</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info de la alerta */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs text-orange-600 font-semibold mb-0.5">Producto a reponer</p>
          <p className="text-sm font-bold text-gray-900">{alerta.producto?.nombre ?? `Producto #${alerta.id_producto}`}</p>
        </div>

        {error && <p className="text-red-600 text-xs mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Almacén destino *</label>
            <select
              value={form.id_almacen}
              onChange={e => setForm(p => ({ ...p, id_almacen: e.target.value }))}
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] bg-white"
            >
              <option value="">Seleccionar almacén...</option>
              {almacenes.map(a => <option key={a.id_almacen} value={a.id_almacen}>{a.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cantidad a pedir *</label>
            <input
              type="number" min="1"
              value={form.cantidad}
              onChange={e => setForm(p => ({ ...p, cantidad: e.target.value }))}
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332]"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-[#1B4332] text-white font-bold text-sm rounded-xl hover:bg-[#163829] disabled:opacity-60">
              {saving ? 'Creando...' : 'Crear orden'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Página Alertas ────────────────────────────────────────────────────────────
export default function Alertas() {
  const [alertas,     setAlertas]     = useState([])
  const [loading,     setLoading]     = useState(true)
  const [marking,     setMarking]     = useState(null)
  const [markingAll,  setMarkingAll]  = useState(false)
  const [reposicion,  setReposicion]  = useState(null) // alerta seleccionada para reponer

  const fetchData = () => {
    setLoading(true)
    getAlertas().then(setAlertas).finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleLeer = async (id) => {
    setMarking(id)
    try { await marcarAlertaLeida(id); setAlertas(p => p.filter(a => a.id_alerta !== id)) }
    catch {} finally { setMarking(null) }
  }

  const handleLeerTodas = async () => {
    setMarkingAll(true)
    try { await marcarTodasLeidas(); setAlertas([]) }
    catch {} finally { setMarkingAll(false) }
  }

  const handleReposicionCreada = () => {
    setReposicion(null)
    // marcar la alerta como leída
    if (reposicion) handleLeer(reposicion.id_alerta)
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div className="space-y-5">
      {reposicion && (
        <ReposicionModal
          alerta={reposicion}
          onClose={() => setReposicion(null)}
          onCreated={handleReposicionCreada}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Alertas</h1>
          <p className="text-gray-500 text-sm mt-0.5">{alertas.length} alertas sin leer</p>
        </div>
        {alertas.length > 0 && (
          <button
            onClick={handleLeerTodas}
            disabled={markingAll}
            className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-[#1B4332] text-[#1B4332] font-semibold text-sm rounded-xl hover:bg-green-50 disabled:opacity-60 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            {markingAll ? 'Marcando...' : 'Marcar todas como leídas'}
          </button>
        )}
      </div>

      {alertas.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-20 text-center text-gray-400">
          <BellOff className="w-14 h-14 mx-auto mb-4 opacity-30" />
          <p className="font-semibold text-gray-500">Sin alertas pendientes</p>
          <p className="text-sm mt-1">Todo el inventario está en orden</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alertas.map(a => (
            <div
              key={a.id_alerta}
              className={`bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 p-5 flex items-start gap-4 hover:shadow-md transition-shadow ${tipoColors[a.tipo_alerta] ?? 'border-l-gray-300'}`}
            >
              <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${tipoIconColors[a.tipo_alerta] ?? 'text-gray-500'}`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    a.tipo_alerta === 'STOCK_CERO'          ? 'bg-red-100 text-red-700' :
                    a.tipo_alerta === 'STOCK_MINIMO'        ? 'bg-orange-100 text-orange-700' :
                    a.tipo_alerta === 'VENCIMIENTO_PROXIMO' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {a.tipo_alerta?.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(a.fecha_generada).toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
                <p className="text-gray-800 font-medium text-sm">{a.mensaje}</p>
                <div className="flex gap-4 mt-2">
                  {a.producto && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Package className="w-3.5 h-3.5" />{a.producto.nombre}
                    </span>
                  )}
                  {a.almacen && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Warehouse className="w-3.5 h-3.5" />{a.almacen.nombre}
                    </span>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {/* Botón Reponer (solo para alertas de stock) */}
                {(a.tipo_alerta === 'STOCK_MINIMO' || a.tipo_alerta === 'STOCK_CERO') && a.id_producto && (
                  <button
                    onClick={() => setReposicion(a)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors"
                    title="Crear orden de reposición"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Reponer
                  </button>
                )}
                <button
                  onClick={() => handleLeer(a.id_alerta)}
                  disabled={marking === a.id_alerta}
                  className="p-2 rounded-xl text-gray-400 hover:text-[#1B4332] hover:bg-green-50 disabled:opacity-40 transition-colors"
                  title="Marcar como leída"
                >
                  {marking === a.id_alerta ? <Spinner size="sm" /> : <Bell className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
