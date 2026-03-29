import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { cn } from '../../utils/cn'
import { Button } from '../ui/Button'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()

  const links = [
    { label: t.nav.home, to: '/' },
    { label: t.nav.inventory, to: '/inventory' },
    { label: t.nav.about, to: '/about' },
    { label: t.nav.contact, to: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-accent-gold/20 bg-surface-900/95 backdrop-blur-2xl">
      <div className="section-container flex h-16 items-center justify-between gap-3">
        <Link to="/" className="group inline-flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-accent-gold/30 bg-accent-gold/20 font-display text-sm font-semibold text-accent-gold">
            GF
          </span>
          <div>
            <p className="font-display text-sm leading-none text-white transition group-hover:text-accent-gold">
              GF Custom Golf Carts
            </p>
            <p className="text-xs text-surface-300">Texas Builds</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3 py-2 text-sm transition',
                  isActive ? 'bg-accent-gold/20 text-accent-gold' : 'text-surface-300 hover:text-white',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-surface-100"
          >
            {language === 'en' ? 'ES' : 'EN'}
          </button>
          <Button size="sm" onClick={() => window.location.assign('/contact')}>
            {t.nav.quote}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white md:hidden"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-white/10 bg-surface-900/95 md:hidden"
          >
            <div className="section-container safe-bottom flex flex-col gap-2 py-4">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl border px-4 py-3 text-sm',
                      isActive
                        ? 'border-accent-gold/35 bg-accent-gold/10 text-accent-gold'
                        : 'border-white/10 bg-white/[0.02] text-surface-100',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={toggleLanguage}
                className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-left text-sm text-surface-100"
              >
                {t.nav.language}: {language === 'en' ? 'Español' : 'English'}
              </button>
              <Button fullWidth className="mt-1" onClick={() => window.location.assign('/contact')}>
                {t.nav.quote}
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
