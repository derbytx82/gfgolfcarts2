import { AlertCircle, BadgeCheck, MessageCircleMore } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/common/EmptyState'
import { Badge } from '../components/common/Badge'
import { ProductGallery } from '../components/product/ProductGallery'
import { SEO } from '../components/seo/SEO'
import { buildBreadcrumbJsonLd, buildProductJsonLd } from '../components/seo/jsonLd'
import { Button } from '../components/ui/Button'
import { useLanguage } from '../context/LanguageContext'
import { fallbackProducts } from '../data/fallback'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { useWhatsAppMessage } from '../hooks/useWhatsAppMessage'
import { getProductBySlug } from '../services/productsService'
import type { Product } from '../types'
import { formatCurrency } from '../utils/formatters'
import { buildWhatsAppUrl, whatsappMessages } from '../utils/whatsapp'

export function ProductDetailPage() {
  const { t, language } = useLanguage()
  const { slug } = useParams<{ slug: string }>()
  const { settings } = useSiteSettings()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) {
        setLoading(false)
        return
      }

      try {
        const response = await getProductBySlug(slug)

        if (response) {
          setProduct(response)
        } else {
          const fallback = fallbackProducts.find((item) => item.slug === slug) ?? null
          setProduct(fallback)
        }
      } catch {
        const fallback = fallbackProducts.find((item) => item.slug === slug) ?? null
        setProduct(fallback)
      } finally {
        setLoading(false)
      }
    }

    void loadProduct()
  }, [slug])

  const whatsappMessage = useMemo(
    () =>
      product
        ? language === 'es'
          ? `Hola, me interesa este modelo: ${product.name}.`
          : `Hi, I'm interested in this model: ${product.name}.`
        : language === 'es'
          ? whatsappMessages.general
          : 'Hi, I want information about your golf carts.',
    [language, product],
  )

  useWhatsAppMessage(whatsappMessage, [whatsappMessage])

  if (loading) {
    return (
      <div className="section-container py-10">
        <div className="rounded-2xl border border-surface-300/70 bg-white p-8 text-center text-surface-700">
          {t.common.loading}
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="section-container py-10">
        <EmptyState
          title={t.common.notFoundTitle}
          description={t.common.notFoundDesc}
          actionLabel={t.home.viewInventory}
          actionTo="/inventory"
        />
      </div>
    )
  }

  const whatsappNumber = settings.whatsapp_number ?? import.meta.env.VITE_WHATSAPP_NUMBER ?? ''
  const whatsappUrl = whatsappNumber ? buildWhatsAppUrl(whatsappNumber, whatsappMessage) : '#'

  return (
    <div className="section-container py-8 sm:py-10">
      <SEO
        title={product.name}
        description={product.full_description ?? product.short_description ?? `${product.name} — custom golf cart available at GF Custom Golf Carts in Fort Worth, TX.`}
        canonical={`/inventory/${product.slug}`}
        ogType="product"
        ogImage={product.cover_image ?? undefined}
        jsonLd={[
          buildProductJsonLd(product),
          buildBreadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Inventory', url: '/inventory' },
            { name: product.name, url: `/inventory/${product.slug}` },
          ]),
        ]}
      />
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <ProductGallery
          coverImage={product.cover_image}
          galleryImages={product.gallery_images}
          productName={product.name}
        />

        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-surface-400">{product.category ?? 'Custom Build'}</p>
            <h1 className="mt-2 font-display text-3xl text-surface-950 sm:text-4xl">{product.name}</h1>
            <p className="mt-3 text-sm text-surface-700">{product.full_description ?? product.short_description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(product.tags ?? []).map((tag) => (
              <Badge key={tag} tone={tag.includes('Street') ? 'accent' : 'default'}>
                {tag}
              </Badge>
            ))}
          </div>

          <div className="rounded-2xl border border-surface-300/70 bg-white p-4 shadow-premium">
            <p className="font-display text-2xl text-accent-gold">{formatCurrency(product.price)}</p>
            <p className="mt-2 inline-flex items-center gap-2 text-sm text-surface-700">
              <BadgeCheck size={16} className="text-accent-gold" />
              {product.available ? t.common.available : t.common.buildToOrder}
            </p>
          </div>

          <div className="grid gap-2 rounded-2xl border border-surface-300/70 bg-white p-4 shadow-premium">
            <h2 className="font-display text-xl text-surface-950">Specs</h2>
            {product.specs ? (
              Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between gap-3 border-b border-white/5 py-2 text-sm last:border-none">
                  <span className="text-surface-700">{key}</span>
                  <span className="text-surface-950">{value}</span>
                </div>
              ))
            ) : (
              <p className="inline-flex items-center gap-2 text-sm text-surface-700">
                <AlertCircle size={16} />
                Specs will be updated soon.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to={`/contact?product=${encodeURIComponent(product.name)}`}>
              <Button size="lg">{t.common.requestQuote}</Button>
            </Link>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <Button variant="secondary" size="lg" className="bg-surface-100 text-surface-950">
                <MessageCircleMore size={17} className="mr-2" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
