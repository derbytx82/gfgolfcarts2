import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Star, Wrench } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductCard } from '../components/inventory/ProductCard'
import { SectionHeader } from '../components/common/SectionHeader'
import { SEO } from '../components/seo/SEO'
import { buildLocalBusinessJsonLd, buildWebSiteJsonLd } from '../components/seo/jsonLd'
import { Button } from '../components/ui/Button'
import {
  fallbackContentMap,
  fallbackGallery,
  fallbackProducts,
  fallbackTestimonials,
  upgradesCatalog,
  whyChooseUsItems,
} from '../data/fallback'
import { useLanguage } from '../context/LanguageContext'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { useWhatsAppMessage } from '../hooks/useWhatsAppMessage'
import { getSiteContentMap } from '../services/contentService'
import { getGalleryItems } from '../services/galleryService'
import { getFeaturedProducts } from '../services/productsService'
import { getTestimonials } from '../services/testimonialsService'
import type { GalleryItem, Product, SiteContent, SiteContentKey, Testimonial } from '../types'
import { fadeInUp, staggerContainer } from '../utils/motion'

type ContentMap = Record<SiteContentKey, SiteContent>

export function HomePage() {
  const { t, language } = useLanguage()
  const { settings } = useSiteSettings()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(fallbackProducts.filter((item) => item.featured))
  const [contentMap, setContentMap] = useState<ContentMap>(fallbackContentMap)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials)
  const [gallery, setGallery] = useState<GalleryItem[]>(fallbackGallery)

  useWhatsAppMessage(
    language === 'es'
      ? 'Hola, quiero información sobre sus golf carts.'
      : 'Hi, I want information about your golf carts.',
    [language],
  )

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [productsResponse, contentResponse, testimonialResponse, galleryResponse] = await Promise.all([
          getFeaturedProducts(6),
          getSiteContentMap(),
          getTestimonials(true),
          getGalleryItems(),
        ])

        if (productsResponse.length > 0) {
          setFeaturedProducts(productsResponse)
        }

        if (Object.keys(contentResponse).length > 0) {
          setContentMap((previous) => ({ ...previous, ...(contentResponse as Partial<ContentMap>) }))
        }

        if (testimonialResponse.length > 0) {
          setTestimonials(testimonialResponse)
        }

        if (galleryResponse.length > 0) {
          setGallery(galleryResponse)
        }
      } catch {
        setFeaturedProducts(fallbackProducts.filter((item) => item.featured))
      }
    }

    void loadHomeData()
  }, [])

  const heroBackground = useMemo(
    () => contentMap.hero.image_url || settings.hero_background || fallbackContentMap.hero.image_url,
    [contentMap.hero.image_url, settings.hero_background],
  )

  return (
    <div className="pb-10">
      <SEO
        title="GF Custom Golf Carts"
        description="Premium custom and street-legal golf carts in Fort Worth, Texas. Lithium upgrades, lifted builds, audio systems, and full customization. Browse inventory or request a quote."
        canonical="/"
        jsonLd={[buildLocalBusinessJsonLd(settings), buildWebSiteJsonLd()]}
      />
      <section className="section-container pt-6 sm:pt-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-mesh-gradient shadow-premium"
        >
          <img src={heroBackground ?? undefined} alt="GF Custom Golf Carts" className="h-[480px] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-950/95 via-surface-900/80 to-surface-900/45" />
          <div className="absolute -left-16 top-8 h-52 w-52 rounded-full bg-accent-gold/25 blur-3xl" />
          <div className="absolute -right-8 bottom-8 h-52 w-52 rounded-full bg-accent-emerald/30 blur-3xl" />
          <div className="absolute inset-0 bg-soft-grid bg-[size:42px_42px] opacity-15" />

          <div className="absolute inset-0 flex items-end p-5 sm:items-center sm:p-10">
            <motion.div variants={fadeInUp} className="max-w-xl">
              <p className="inline-flex rounded-full border border-accent-gold/35 bg-accent-gold/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent-gold">
                {contentMap.hero.subtitle}
              </p>
              <h1 className="mt-4 bg-gradient-to-r from-white via-accent-gold to-accent-emerald bg-clip-text font-display text-4xl leading-tight text-transparent sm:text-6xl">
                {contentMap.hero.title}
              </h1>
              <p className="mt-3 max-w-lg text-sm text-surface-200 sm:text-base">{contentMap.hero.body}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={contentMap.hero.cta_link ?? '/inventory'}>
                  <Button size="lg">{contentMap.hero.cta_text ?? 'Shop Carts'}</Button>
                </Link>
                <Link to="/inventory">
                  <Button size="lg" variant="secondary" className="text-white">
                    {t.home.viewInventory}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="section-container mt-14">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            {
              title: 'Street-Legal Ready',
              text: 'Built for real neighborhood and community use in Texas.',
              icon: ShieldCheck,
            },
            {
              title: 'Custom Premium Upgrades',
              text: 'Wheels, seats, lithium, audio, lighting and full finishes.',
              icon: Wrench,
            },
            {
              title: 'Upgraded Inventory',
              text: 'Ready-to-ride carts with fast turnaround and support.',
              icon: Sparkles,
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
                className="glass-panel rounded-2xl p-5"
              >
                <Icon className="text-accent-gold" size={24} />
                <h3 className="mt-3 font-display text-lg text-surface-950">{item.title}</h3>
                <p className="mt-2 text-sm text-surface-700">{item.text}</p>
              </motion.article>
            )
          })}
        </div>
      </section>

      <section className="section-container mt-18">
        <SectionHeader
          eyebrow={t.home.featured}
          title={t.home.featuredTitle}
          subtitle={contentMap.brand_intro.body ?? fallbackContentMap.brand_intro.body ?? undefined}
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link to="/inventory">
            <Button variant="secondary">
              {t.home.viewInventory} <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="section-container mt-18">
        <div className="grid gap-8 rounded-3xl border border-surface-300/70 bg-gradient-to-r from-white via-accent-gold/10 to-accent-emerald/15 p-6 shadow-premium sm:p-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeader
              eyebrow="Custom Upgrades"
              title={contentMap.custom_upgrades.title ?? 'Upgrades That Elevate Every Ride'}
              subtitle={contentMap.custom_upgrades.body ?? undefined}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {upgradesCatalog.map((upgrade) => (
              <div key={upgrade} className="inline-flex items-center gap-2 rounded-xl border border-surface-300/60 bg-white px-3 py-2 text-sm text-surface-950">
                <CheckCircle2 size={15} className="text-accent-gold" />
                {upgrade}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-container mt-18">
        <SectionHeader
          eyebrow={t.home.whyTitle}
          title={contentMap.why_choose_us.title ?? t.home.whySubtitle}
          subtitle={contentMap.why_choose_us.body ?? undefined}
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {whyChooseUsItems.map((item) => (
            <div key={item.title} className="rounded-2xl border border-surface-300/70 bg-white p-5 shadow-premium">
              <h3 className="font-display text-xl text-surface-950">{item.title}</h3>
              <p className="mt-2 text-sm text-surface-700">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container mt-18">
        <SectionHeader
          eyebrow={t.home.galleryTitle}
          title={t.home.galleryTitle}
          subtitle={t.home.gallerySubtitle}
        />

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {gallery.slice(0, 6).map((item, index) => (
            <motion.figure
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] ${index % 3 === 0 ? 'sm:col-span-2' : ''}`}
            >
              <img src={item.image_url} alt={item.title} className="h-48 w-full object-cover sm:h-60" />
            </motion.figure>
          ))}
        </div>
      </section>

      <section className="section-container mt-18">
        <SectionHeader eyebrow={t.home.testimonials} title={t.home.testimonialsTitle} align="center" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {testimonials.slice(0, 4).map((testimonial) => (
            <div key={testimonial.id} className="rounded-2xl border border-surface-300/70 bg-white p-5 shadow-premium">
              <div className="mb-3 inline-flex items-center gap-1 text-accent-gold">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm text-surface-950">“{testimonial.quote}”</p>
              <p className="mt-3 text-xs uppercase tracking-[0.15em] text-surface-700">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-container mt-18">
        <div className="rounded-3xl border border-accent-gold/35 bg-gradient-to-r from-accent-gold/20 via-surface-900/80 to-accent-emerald/25 p-7 sm:p-10">
          <h2 className="font-display text-3xl text-white sm:text-4xl">
            {contentMap.final_cta.title ?? 'Ready to Build Your Custom Cart?'}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-surface-200 sm:text-base">
            {contentMap.final_cta.body ?? 'Talk with GF Custom Golf Carts and get your personalized quote today.'}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/contact">
              <Button size="lg">{t.home.finalPrimary}</Button>
            </Link>
            <Link to="/inventory">
              <Button variant="secondary" size="lg" className="text-white">
                {t.home.finalSecondary}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
