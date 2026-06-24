import { useState, useEffect } from 'react'
import { Building2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [approving, setApproving] = useState(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await fetch('https://api.almacontrol.shop/api/leads', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('almacontrol_token')}`
        }
      })
      if (!res.ok) throw new Error('Error al obtener leads')
      const data = await res.json()
      setLeads(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    setApproving(id)
    try {
      const res = await fetch(`https://api.almacontrol.shop/api/leads/${id}/approve`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('almacontrol_token')}`
        }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Error al aprobar')
      
      // Eliminar de la lista visual
      setLeads(leads.filter(l => l.id_lead !== id))
      alert('¡Lead aprobado con éxito! Se ha enviado el correo.')
    } catch (err) {
      alert(err.message)
    } finally {
      setApproving(null)
    }
  }

  if (loading) return <div className="p-6 text-gray-500">Cargando leads...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#F59E0B]" />
            Leads Pendientes
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Aprueba las solicitudes de nuevas empresas para generar sus accesos
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No hay leads pendientes por aprobar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                <tr>
                  <th className="px-6 py-4">Empresa</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">Tamaño</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead) => (
                  <tr key={lead.id_lead} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{lead.empresa}</td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{lead.nombre}</p>
                      <p className="text-gray-500 text-xs">{lead.correo}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{lead.tamano_empresa}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleApprove(lead.id_lead)}
                        disabled={approving === lead.id_lead}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-sm transition-all
                          ${approving === lead.id 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700 active:scale-95'
                          }`}
                      >
                        {approving === lead.id ? 'Aprobando...' : 'Aprobar'}
                      </button>
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
