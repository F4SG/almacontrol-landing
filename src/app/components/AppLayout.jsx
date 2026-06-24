import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logout } from '../services/api'
import {
  Package, LayoutDashboard, Boxes, Warehouse,
  TruckIcon, ArrowLeftRight, ShoppingCart, Bell,
  LogOut, Menu, X, ChevronRight, User, Scan
} from 'lucide-react'

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/escaner',     icon: Scan,            label: 'Escáner' },
  { to: '/productos',   icon: Package,         label: 'Productos' },
  { to: '/inventario',  icon: Boxes,           label: 'Inventario' },
  { to: '/movimientos', icon: ArrowLeftRight,  label: 'Movimientos' },
  { to: '/almacenes',   icon: Warehouse,       label: 'Almacenes' },
  { to: '/proveedores', icon: TruckIcon,       label: 'Proveedores' },
  { to: '/ordenes',     icon: ShoppingCart,    label: 'Órdenes' },
  { to: '/alertas',     icon: Bell,            label: 'Alertas' },
]

export default function AppLayout({ children }) {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    try { await logout() } catch {}
    logoutUser()
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 bg-[#F59E0B] rounded-lg flex items-center justify-center flex-shrink-0">
          <Package className="w-5 h-5 text-gray-900" />
        </div>
        <div>
          <p className="font-bold text-white text-sm leading-tight">AlmaControl</p>
          <p className="text-[10px] text-green-300">Sistema de Inventario</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-[#F59E0B] text-gray-900 shadow-md'
                  : 'text-green-100 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="w-4.5 h-4.5 flex-shrink-0" />
            {label}
            <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/10 p-3 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
          <div className="w-7 h-7 bg-[#F59E0B] rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-gray-900" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">
              {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
            </p>
            <p className="text-green-300 text-[10px] truncate">
              {user?.rol?.nombre ?? 'Sin rol'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-[#1B4332] shadow-xl flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Sidebar Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-[#1B4332] shadow-xl flex flex-col md:hidden transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className={`h-14 border-b flex items-center gap-3 px-4 flex-shrink-0 transition-colors ${
          location.pathname === '/escaner' 
            ? 'bg-gray-950 border-gray-800' 
            : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className={`md:hidden p-1.5 rounded-lg transition-colors ${
              location.pathname === '/escaner'
                ? 'text-gray-400 hover:bg-gray-800'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <NavLink
            to="/alertas"
            className={`relative p-1.5 rounded-lg transition-colors ${
              location.pathname === '/escaner'
                ? 'text-gray-400 hover:bg-gray-800 hover:text-[#F59E0B]'
                : 'text-gray-500 hover:bg-gray-100 hover:text-[#1B4332]'
            }`}
          >
            <Bell className="w-5 h-5" />
          </NavLink>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>
    </div>
  )
}
