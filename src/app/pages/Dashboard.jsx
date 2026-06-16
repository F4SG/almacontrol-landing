import { useEffect, useState } from 'react'
import { getDashboard } from '../services/api'
import Spinner from '../components/Spinner'
import { Package, Warehouse, Bell, ArrowLeftRight, AlertTriangle } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-gray-900 leading-tight">{value ?? 0}</p>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => setError(err?.message || 'Error al cargar el dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-700">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <p className="font-medium">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen del sistema en tiempo real</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="Total Productos"
          value={data?.total_productos}
          color="bg-green-100 text-[#1B4332]"
        />
        <StatCard
          icon={Warehouse}
          label="Total Almacenes"
          value={data?.total_almacenes}
          color="bg-amber-100 text-[#D97706]"
        />
        <StatCard
          icon={Bell}
          label="Alertas sin leer"
          value={data?.alertas_sin_leer}
          color="bg-red-100 text-red-600"
        />
        <StatCard
          icon={ArrowLeftRight}
          label="Movimientos hoy"
          value={data?.movimientos_hoy}
          color="bg-blue-100 text-blue-600"
        />
      </div>

      {/* Stock crítico */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="font-bold text-gray-900">Stock Crítico</h2>
          <span className="ml-auto text-xs text-gray-400">
            Productos con stock ≤ mínimo
          </span>
        </div>

        {data?.stock_critico?.length === 0 ? (
          <div className="px-6 py-10 text-center text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Sin stock crítico — ¡Todo en orden!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Almacén</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock Actual</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mínimo</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data?.stock_critico?.map((item) => (
                  <tr key={`${item.id_producto}-${item.almacen}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.nombre}</td>
                    <td className="px-6 py-4 text-gray-600">{item.almacen}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold ${item.stock_actual === 0 ? 'text-red-600' : 'text-orange-500'}`}>
                        {item.stock_actual}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">{item.stock_minimo}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        item.stock_actual === 0
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {item.stock_actual === 0 ? 'Sin stock' : 'Bajo mínimo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
