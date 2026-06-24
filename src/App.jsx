import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Landing
import Navbar         from './components/Navbar'
import Hero           from './components/Hero'
import ProblemSolution from './components/ProblemSolution'
import Features       from './components/Features'
import Pricing        from './components/Pricing'
import Testimonials   from './components/Testimonials'
import CaptureForm    from './components/CaptureForm'
import Footer         from './components/Footer'
import Modal          from './components/Modal'

// App interno
import PrivateRoute   from './app/components/PrivateRoute'
import AppLayout      from './app/components/AppLayout'
import Login          from './app/pages/Login'
import Register       from './app/pages/Register'
import Dashboard      from './app/pages/Dashboard'
import Productos      from './app/pages/Productos'
import ProductoForm   from './app/pages/ProductoForm'
import Almacenes      from './app/pages/Almacenes'
import Proveedores    from './app/pages/Proveedores'
import Inventario     from './app/pages/Inventario'
import Movimientos    from './app/pages/Movimientos'
import Ordenes        from './app/pages/Ordenes'
import Alertas        from './app/pages/Alertas'
import Escaner        from './app/pages/Escaner'

function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Hero onCTAClick={() => {
          document.getElementById('captura')?.scrollIntoView({ behavior: 'smooth' })
        }} />
        <ProblemSolution />
        <Features />
        <Pricing />
        <Testimonials />
        <CaptureForm onSuccess={() => setModalOpen(true)} />
      </main>
      <Footer />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}

function AppPage({ children }) {
  return (
    <PrivateRoute>
      <AppLayout>{children}</AppLayout>
    </PrivateRoute>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth */}
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* App (protegidas) */}
      <Route path="/dashboard"        element={<AppPage><Dashboard /></AppPage>} />
      <Route path="/productos"        element={<AppPage><Productos /></AppPage>} />
      <Route path="/productos/nuevo"  element={<AppPage><ProductoForm /></AppPage>} />
      <Route path="/productos/:id"    element={<AppPage><ProductoForm /></AppPage>} />
      <Route path="/almacenes"        element={<AppPage><Almacenes /></AppPage>} />
      <Route path="/proveedores"      element={<AppPage><Proveedores /></AppPage>} />
      <Route path="/inventario"       element={<AppPage><Inventario /></AppPage>} />
      <Route path="/movimientos"      element={<AppPage><Movimientos /></AppPage>} />
      <Route path="/ordenes"          element={<AppPage><Ordenes /></AppPage>} />
      <Route path="/alertas"          element={<AppPage><Alertas /></AppPage>} />
      <Route path="/escaner"          element={<AppPage><Escaner /></AppPage>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
