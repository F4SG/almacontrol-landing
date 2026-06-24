import { useEffect } from 'react'
import { Package, FileText, X, Printer } from 'lucide-react'

export default function ReporteImprimible({ titulo, subtitulo, columnas, datos, onClose }) {
  useEffect(() => {
    // Añadimos una clase al body temporalmente para ocultar cosas si es necesario
    document.body.classList.add('print-mode-active')
    return () => document.body.classList.remove('print-mode-active')
  }, [])

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
      {/* Barra de herramientas fija (no se imprime) */}
      <div className="sticky top-0 bg-gray-900 text-white px-6 py-4 flex items-center justify-between print:hidden shadow-lg">
        <div>
          <h2 className="font-bold text-lg">Vista Previa de Impresión</h2>
          <p className="text-xs text-gray-400">Verifica el reporte antes de imprimir o guardar como PDF.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white font-semibold text-sm rounded-xl hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-2 bg-[#F59E0B] text-gray-900 font-bold text-sm rounded-xl hover:bg-[#d98b09] transition-colors shadow-md"
          >
            <Printer className="w-4 h-4" /> Imprimir / PDF
          </button>
        </div>
      </div>

      {/* Contenido imprimible */}
      <div className="bg-white mx-auto max-w-5xl p-10 print:p-0 print:max-w-none">
        
        {/* Cabecera del Reporte */}
        <div className="flex items-start justify-between border-b-4 border-[#1B4332] pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-[#1B4332] rounded-2xl flex items-center justify-center flex-shrink-0 print:bg-[#1B4332] print:text-white" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
              <Package className="w-8 h-8 text-[#F59E0B]" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-[#1B4332] tracking-tight m-0 leading-none">AlmaControl</h1>
              <p className="text-sm font-semibold tracking-widest text-[#F59E0B] uppercase mt-1">Gestión Inteligente</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">{titulo}</h2>
            <p className="text-gray-500 font-medium mt-1">{subtitulo}</p>
            <p className="text-xs text-gray-400 mt-2">
              Generado el: {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tabla de Datos */}
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-[#1B4332] text-white" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
              {columnas.map((col, i) => (
                <th key={i} className={`px-4 py-3 font-bold uppercase tracking-wider text-xs border border-[#163829] ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {datos.length === 0 ? (
              <tr>
                <td colSpan={columnas.length} className="px-4 py-8 text-center text-gray-500 border border-gray-200">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  No hay datos para mostrar en este reporte.
                </td>
              </tr>
            ) : (
              datos.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 print:break-inside-avoid">
                  {columnas.map((col, j) => (
                    <td key={j} className={`px-4 py-3 text-gray-800 border-x border-b border-gray-200 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pie de página */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-400 font-medium pb-8">
          <p>Documento generado automáticamente por el sistema AlmaControl.</p>
          <p>Confidencial - Solo para uso interno.</p>
        </div>
      </div>
    </div>
  )
}
