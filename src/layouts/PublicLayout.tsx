import { Outlet } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { WhatsAppFloat } from '../components/layout/WhatsAppFloat'

export function PublicLayout() {
  return (
    <div className="noise-overlay min-h-screen bg-surface-100 text-surface-950">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
