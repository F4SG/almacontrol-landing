import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProblemSolution from './components/ProblemSolution'
import Features from './components/Features'
import Pricing from './components/Pricing'
import Testimonials from './components/Testimonials'
import CaptureForm from './components/CaptureForm'
import Footer from './components/Footer'
import Modal from './components/Modal'

function App() {
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

export default App
