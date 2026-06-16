import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProductos, deleteProducto } from '../services/api'
import Spinner from '../components/Spinner'
import { Plus, Search, Edit2, Trash2, AlertTriangle, Package, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Productos() {
  const navigate = useNavigate()
  const [data, setData]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [page, setPage]         = useState(1)
  const [deleting, setDeleting] = useState(null)

  const fetchData = (p = 1) => {
    setLoading(true)
    getProductos(p)
      .then(setData)
      .catch((err) => setError(err?.message || 'Error al cargar productos'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData(page) }, [page])

  const filtered = data?.data?.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  ) ?? []

  const handleDelete = async (id) => {
    if (!window.confirm('¿Desactivar este producto?')) return
    setDeleting(id)
    try {
      await deleteProducto(id)
      fetchData(page)
    } catch { alert('Error al desactivar') } finally { setDeleting(null) }
  }

  if (loading && !data) return (
    <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
  )

  if (error) return (
    <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-700">
      <AlertTriangle className="w-5 h-5" /><p>{error}</p>
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Productos</h1>
          <p className="text-gray-500 text-sm mt-0.5">{data?.total ?? 0} productos registrados</p>
        </div>
        <Link
          to="/productos/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1B4332] text-white font-semibold text-sm rounded-xl hover:bg-[#163829] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo producto
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1B4332] transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-32"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No se encontraron productos</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio venta</th>
                  <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock mín.</th>
                  <th className="text-center px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p.id_producto} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{p.nombre}</p>
                      {p.codigo_interno && <p className="text-xs text-gray-400">#{p.codigo_interno}</p>}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.categoria?.nombre ?? '—'}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      {p.precio_venta != null ? `Bs ${Number(p.precio_venta).toFixed(2)}` : '—'}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">{p.stock_minimo ?? 0}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        p.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => navigate(`/productos/${p.id_producto}`)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#1B4332] hover:bg-green-50 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id_producto)}
                          disabled={deleting === p.id_producto}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                          title="Desactivar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.last_page > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Página {data.current_page} de {data.last_page}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.last_page, p + 1))}
                disabled={page === data.last_page}
                className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
