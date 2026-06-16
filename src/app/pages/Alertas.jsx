import { useEffect, useState } from 'react'
import { getAlertas, marcarAlertaLeida, marcarTodasLeidas } from '../services/api'
import Spinner from '../components/Spinner'
import { Bell, BellOff, CheckCheck, AlertTriangle, Package, Warehouse } from 'lucide-react'

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

export default function Alertas() {
  const [alertas,  setAlertas]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [marking,  setMarking]  = useState(null)
  const [markingAll, setMarkingAll] = useState(false)

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

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>

  return (
    <div className="space-y-5">
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
                    a.tipo_alerta === 'STOCK_CERO' ? 'bg-red-100 text-red-700' :
                    a.tipo_alerta === 'STOCK_MINIMO' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {a.tipo_alerta?.replace('_', ' ')}
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

              <button
                onClick={() => handleLeer(a.id_alerta)}
                disabled={marking === a.id_alerta}
                className="flex-shrink-0 p-2 rounded-xl text-gray-400 hover:text-[#1B4332] hover:bg-green-50 disabled:opacity-40 transition-colors"
                title="Marcar como leída"
              >
                {marking === a.id_alerta ? <Spinner size="sm" /> : <Bell className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
