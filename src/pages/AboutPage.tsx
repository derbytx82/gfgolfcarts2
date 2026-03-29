import { Award, Handshake, MapPinHouse, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SectionHeader } from '../components/common/SectionHeader'
import { SEO } from '../components/seo/SEO'
import { buildLocalBusinessJsonLd } from '../components/seo/jsonLd'
import { Button } from '../components/ui/Button'
import { useLanguage } from '../context/LanguageContext'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { useWhatsAppMessage } from '../hooks/useWhatsAppMessage'

export function AboutPage() {
  const { t, language } = useLanguage()
  const { settings } = useSiteSettings()
  useWhatsAppMessage(
    language === 'es'
      ? 'Hola, quiero cotizar un golf cart personalizado.'
      : 'Hi, I want to request a quote for a custom golf cart.',
    [language],
  )

  return (
    <div className="section-container py-8 sm:py-10">
      <SEO
        title="About Us"
        description="Learn about GF Custom Golf Carts — a Fort Worth, Texas team specializing in premium custom and street-legal golf carts with personalized service."
        canonical="/about"
        jsonLd={buildLocalBusinessJsonLd(settings)}
      />
      <SectionHeader
        eyebrow={t.about.eyebrow}
        title={t.about.title}
        subtitle={t.about.subtitle}
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          {
            icon: Award,
            title: 'Premium Craftsmanship',
            body: 'High-end finishes, upgraded components and attention to every detail.',
          },
          {
            icon: ShieldCheck,
            title: 'Street-Legal Focus',
            body: 'Builds designed for practical neighborhood use and legal peace of mind.',
          },
          {
            icon: Handshake,
            title: 'Personalized Service',
            body: 'One-on-one guidance from first inquiry to final delivery.',
          },
          {
            icon: MapPinHouse,
            title: 'Local Texas Trust',
            body: 'A local team supporting riders across Houston and surrounding areas.',
          },
        ].map((item) => {
          const Icon = item.icon
          return (
            <article key={item.title} className="rounded-2xl border border-surface-300/70 bg-white p-5 shadow-premium">
              <Icon size={22} className="text-accent-gold" />
              <h3 className="mt-3 font-display text-xl text-surface-950">{item.title}</h3>
              <p className="mt-2 text-sm text-surface-700">{item.body}</p>
            </article>
          )
        })}
      </div>

      <div className="mt-10 rounded-3xl border border-accent-gold/30 bg-gradient-to-r from-surface-900 to-accent-emerald/20 p-7 sm:p-9">
        <h2 className="font-display text-3xl text-white">{t.about.ctaTitle}</h2>
        <p className="mt-3 max-w-2xl text-sm text-surface-200 sm:text-base">
          {t.about.ctaBody}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/contact">
            <Button size="lg">{t.about.ctaPrimary}</Button>
          </Link>
          <Link to="/inventory">
            <Button variant="secondary" size="lg" className="text-white">
              {t.about.ctaSecondary}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
