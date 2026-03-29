import { Link } from 'react-router-dom'
import { SEO } from '../components/seo/SEO'
import { Button } from '../components/ui/Button'
import { useLanguage } from '../context/LanguageContext'

export function NotFoundPage() {
  const { t } = useLanguage()

  return (
    <div className="section-container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Browse our golf cart inventory or contact us."
        noIndex
      />
      <p className="text-xs uppercase tracking-[0.2em] text-accent-gold">404</p>
      <h1 className="mt-3 font-display text-4xl text-surface-950">{t.common.notFoundTitle}</h1>
      <p className="mt-3 max-w-md text-sm text-surface-700">{t.common.notFoundDesc}</p>
      <Link to="/" className="mt-6">
        <Button>{t.common.backHome}</Button>
      </Link>
    </div>
  )
}
