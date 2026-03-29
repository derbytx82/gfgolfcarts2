import { Link2, Mail, MapPin, Phone, Share2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useSiteSettings } from '../../hooks/useSiteSettings'

export function Footer() {
  const { settings } = useSiteSettings()
  const { t } = useLanguage()

  return (
    <footer className="mt-20 border-t border-accent-gold/25 bg-gradient-to-b from-surface-900 to-surface-950">
      <div className="section-container grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg text-white">{settings.business_name}</p>
          <p className="mt-2 text-sm text-surface-100/80">
            Custom & street-legal golf carts. Upgraded and ready to ride.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent-gold">{t.nav.home === 'Home' ? 'Pages' : 'Páginas'}</p>
          <div className="mt-3 space-y-2 text-sm text-surface-100/90">
            <Link to="/" className="transition hover:text-accent-gold">
              {t.nav.home}
            </Link>
            <br />
            <Link to="/inventory" className="transition hover:text-accent-gold">
              {t.nav.inventory}
            </Link>
            <br />
            <Link to="/about" className="transition hover:text-accent-gold">
              {t.nav.about}
            </Link>
            <br />
            <Link to="/contact" className="transition hover:text-accent-gold">
              {t.nav.contact}
            </Link>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent-gold">Contact</p>
          <div className="mt-3 space-y-3 text-sm text-surface-100/90">
            <p className="inline-flex items-center gap-2">
              <Phone size={14} className="text-accent-gold" />
              {settings.phone ?? 'Not available'}
            </p>
            <p className="inline-flex items-center gap-2">
              <Mail size={14} className="text-accent-gold" />
              {settings.email ?? 'Not available'}
            </p>
            <p className="inline-flex items-center gap-2">
              <MapPin size={14} className="text-accent-gold" />
              {[settings.city, settings.state].filter(Boolean).join(', ') || 'Texas'}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent-gold">Social</p>
          <div className="mt-3 flex items-center gap-3">
            <a
              href={settings.instagram_url ?? '#'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-surface-100 transition hover:border-accent-gold/50 hover:text-accent-gold"
            >
              <Link2 size={16} />
            </a>
            <a
              href={settings.facebook_url ?? '#'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-surface-100 transition hover:border-accent-gold/50 hover:text-accent-gold"
            >
              <Share2 size={16} />
            </a>
          </div>
          <p className="mt-4 text-xs text-surface-100/70">{settings.hours ?? 'Mon - Sat: 9:00 AM - 6:00 PM'}</p>
        </div>
      </div>
    </footer>
  )
}
