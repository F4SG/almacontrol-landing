import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function PersonalList() {
  const { token, user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    id_rol: 2, // 2 = Encargado, 3 = Vendedor
  });

  const fetchUsuarios = async () => {
    try {
      const res = await fetch(`https://api.almacontrol.shop/api/usuarios`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Error al cargar personal');
      const data = await res.json();
      // Extra seguridad: nunca mostrar la cuenta del super-admin de la plataforma
      setUsuarios(data.filter(u => u.correo !== 'admin@almacontrol.bo'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://api.almacontrol.shop/api/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, apellido: '-' }) // apellido default
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear usuario');
      }
      
      setIsModalOpen(false);
      setFormData({ nombre: '', correo: '', contrasena: '', id_rol: 2 });
      fetchUsuarios();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('¿Seguro que deseas desactivar este usuario?')) return;
    try {
      const res = await fetch(`https://api.almacontrol.shop/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al desactivar usuario');
      fetchUsuarios();
    } catch (err) {
      alert(err.message);
    }
  };

  if (user?.rol?.id_rol !== 1) {
    return (
      <div className="p-4 text-red-500 font-bold">Acceso Denegado. Solo administradores.</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">Administra Encargados y Vendedores de tu empresa.</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1B4332] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2D6A4F] transition"
        >
          + Nuevo Usuario
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500">
                <th className="p-4 font-semibold">Nombre</th>
                <th className="p-4 font-semibold">Correo</th>
                <th className="p-4 font-semibold">Rol</th>
                <th className="p-4 font-semibold">Estado</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">Cargando personal...</td></tr>
              ) : usuarios.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">No hay otros usuarios en tu empresa.</td></tr>
              ) : (
                usuarios.map(u => (
                  <tr key={u.id_usuario} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4 text-gray-800 font-medium">{u.nombre}</td>
                    <td className="p-4 text-gray-600">{u.correo}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.rol?.nombre === 'Administrador' ? 'bg-purple-100 text-purple-700' :
                        u.rol?.nombre === 'Encargado' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {u.rol?.nombre || `Rol ${u.id_rol}`}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {u.id_usuario !== user.id_usuario &&
                       u.activo &&
                       u.rol?.nombre !== 'Administrador' &&
                       u.correo !== 'admin@almacontrol.bo' && (
                        <button
                          onClick={() => handleDeactivate(u.id_usuario)}
                          className="text-red-500 hover:text-red-700 font-medium text-xs"
                        >
                          Desactivar
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Crear Nuevo Usuario</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  value={formData.correo}
                  onChange={e => setFormData({ ...formData, correo: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña temporal</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  value={formData.contrasena}
                  onChange={e => setFormData({ ...formData, contrasena: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                  value={formData.id_rol}
                  onChange={e => setFormData({ ...formData, id_rol: parseInt(e.target.value) })}
                >
                  <option value={2}>Encargado (Entradas, salidas, inventario)</option>
                  <option value={3}>Vendedor (Solo vista de inventario)</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1B4332] text-white font-medium rounded-lg hover:bg-[#2D6A4F]"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
