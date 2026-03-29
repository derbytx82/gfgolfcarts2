import { LayoutDashboard, LogOut, PencilLine, Settings2, ShoppingCart } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { cn } from '../utils/cn'

const links = [
  { to: '/golfpanel', label: 'Overview', icon: LayoutDashboard },
  { to: '/golfpanel/products', label: 'Products', icon: ShoppingCart },
  { to: '/golfpanel/content', label: 'Content', icon: PencilLine },
  { to: '/golfpanel/settings', label: 'Settings', icon: Settings2 },
]

export function AdminLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/golfpanel/login')
  }

  return (
    <div className="min-h-screen bg-surface-950">
      <div className="section-container grid gap-6 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-white/10 bg-surface-900/40 p-4 shadow-xl backdrop-blur-md lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <p className="font-display text-lg text-white">GF Admin</p>
          <p className="mt-1 text-xs text-surface-300">Manage inventory and site content</p>
          <nav className="mt-5 grid gap-2">
            {links.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/golfpanel'}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition',
                      isActive ? 'bg-accent-gold/15 text-accent-gold' : 'text-surface-200 hover:bg-white/5',
                    )
                  }
                >
                  <Icon size={16} />
                  {link.label}
                </NavLink>
              )
            })}
          </nav>

          <button
            type="button"
            onClick={() => {
              void handleLogout()
            }}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-surface-100 transition hover:bg-white/10"
          >
            <LogOut size={16} />
            Logout
          </button>
        </aside>

        <section>
          <Outlet />
        </section>
      </div>
    </div>
  )
}