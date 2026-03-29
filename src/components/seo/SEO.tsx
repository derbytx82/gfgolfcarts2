import { Helmet } from 'react-helmet-async'
import { useLanguage } from '../../context/LanguageContext'

const SITE_NAME = 'GF Custom Golf Carts'
const DEFAULT_TITLE_SUFFIX = ' | GF Custom Golf Carts'
const SITE_URL = 'https://gfcustomgolfcarts.com'
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`

export type SEOProps = {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'
  noIndex?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

export function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  noIndex = false,
  jsonLd,
}: SEOProps) {
  const { language } = useLanguage()

  const fullTitle = title === SITE_NAME ? title : `${title}${DEFAULT_TITLE_SUFFIX}`
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : undefined
  const image = ogImage ?? DEFAULT_OG_IMAGE

  return (
    <Helmet>
      <html lang={language} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Canonical */}
      {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

      {/* Robots */}
      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : <meta name="robots" content="index, follow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={image} />
      {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
      <meta property="og:locale" content={language === 'es' ? 'es_US' : 'en_US'} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {jsonLd ? (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : jsonLd)}
        </script>
      ) : null}
    </Helmet>
  )
}
