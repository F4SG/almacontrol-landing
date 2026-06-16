import { useEffect, useState } from 'react'
import { getMovimientos, getAlmacenes } from '../services/api'
import Spinner from '../components/Spinner'
import { ArrowLeftRight, ChevronLeft, ChevronRight, Filter } from 'lucide-react'

const TIPOS = ['', 'ENTRADA', 'SALIDA', 'AJUSTE_POSITIVO', 'AJUSTE_NEGATIVO', 'TRANSFERENCIA']

const tipoColors = {
  ENTRADA:          'bg-green-100 text-green-700',
  SALIDA:           'bg-red-100 text-red-700',
  AJUSTE_POSITIVO:  'bg-blue-100 text-blue-700',
  AJUSTE_NEGATIVO:  'bg-orange-100 text-orange-700',
  TRANSFERENCIA:    'bg-purple-100 text-purple-700',
}

export default function Movimientos() {
  const [data,      setData]      = useState(null)
  const [almacenes, setAlmacenes] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [page,      setPage]      = useState(1)
  const [filters,   setFilters]   = useState({ almacen_id: '', tipo: '', fecha_desde: '', fecha_hasta: '' })

  const fetchData = (p = 1) => {
    setLoading(true)
    const params = { page: p, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) }
    getMovimientos(params)
      .then(setData)
      .finally(() => setLoading(false))
  }

  useEffect(() => { getAlmacenes().then(setAlmacenes).catch(() => {}) }, [])
  useEffect(() => { fetchData(page) }, [page, filters])

  const handleFilter = (e) => {
    setFilters(p => ({ ...p, [e.target.name]: e.target.value }))
    setPage(1)
  }

  const rows = data?.data ?? []

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Movimientos</h1>
        <p className="text-gray-500 text-sm mt-0.5">Historial de entradas y salidas de inventario</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-semibold text-gray-700">Filtros</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select name="almacen_id" value={filters.almacen_id} onChange={handleFilter}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] bg-white">
            <option value="">Todos los almacenes</option>
            {almacenes.map(a => <option key={a.id_almacen} value={a.id_almacen}>{a.nombre}</option>)}
          </select>
          <select name="tipo" value={filters.tipo} onChange={handleFilter}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] bg-white">
            {TIPOS.map(t => <option key={t} value={t}>{t || 'Todos los tipos'}</option>)}
          </select>
          <input type="date" name="fecha_desde" value={filters.fecha_desde} onChange={handleFilter}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332]" />
          <input type="date" name="fecha_hasta" value={filters.fecha_hasta} onChange={handleFilter}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332]" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><Spinner /></div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ArrowLeftRight className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No hay movimientos registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Fecha</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Producto</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Almacén</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Cantidad</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Stock antes</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Stock después</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {rows.map(m => (
                  <tr key={m.id_movimiento} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(m.fecha).toLocaleString('es-BO', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${tipoColors[m.tipo_movimiento] ?? 'bg-gray-100 text-gray-700'}`}>
                        {m.tipo_movimiento}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-900">{m.producto?.nombre ?? '—'}</td>
                    <td className="px-5 py-3.5 text-gray-600">{m.almacen?.nombre ?? '—'}</td>
                    <td className="px-5 py-3.5 text-right font-bold text-gray-900">{m.cantidad}</td>
                    <td className="px-5 py-3.5 text-right text-gray-500">{m.stock_antes}</td>
                    <td className="px-5 py-3.5 text-right text-gray-500">{m.stock_despues}</td>
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
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(data.last_page, p+1))} disabled={page===data.last_page}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
