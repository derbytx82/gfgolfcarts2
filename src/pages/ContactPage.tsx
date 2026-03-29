import { zodResolver } from '@hookform/resolvers/zod'
import { Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { SEO } from '../components/seo/SEO'
import { buildLocalBusinessJsonLd } from '../components/seo/jsonLd'
import { Button } from '../components/ui/Button'
import { Input, TextArea } from '../components/ui/Input'
import { useLanguage } from '../context/LanguageContext'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { useWhatsAppMessage } from '../hooks/useWhatsAppMessage'
import { submitQuoteRequest } from '../services/quoteService'
import { buildWhatsAppUrl } from '../utils/whatsapp'

const quoteSchema = z.object({
  name: z.string().min(2, 'Enter your name'),
  phone: z.string().min(8, 'Enter a valid phone'),
  email: z.string().email('Enter a valid email'),
  product_interest: z.string().optional(),
  message: z.string().min(10, 'Please share more details'),
})

type QuoteFormValues = z.infer<typeof quoteSchema>

export function ContactPage() {
  const { t, language } = useLanguage()
  const { settings } = useSiteSettings()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const productQuery = searchParams.get('product') ?? ''

  useWhatsAppMessage(
    language === 'es'
      ? 'Hola, quiero cotizar un golf cart personalizado.'
      : 'Hi, I want to request a quote for a custom golf cart.',
    [language],
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      message: productQuery
        ? `Hi, I'm interested in this model: ${productQuery}. Please share availability and quote.`
        : '',
      product_interest: productQuery,
    },
  })

  useEffect(() => {
    if (productQuery) {
      setValue('product_interest', productQuery)
    }
  }, [productQuery, setValue])

  const whatsappUrl = useMemo(() => {
    const number = settings.whatsapp_number ?? import.meta.env.VITE_WHATSAPP_NUMBER ?? ''

    if (!number) {
      return '#'
    }

    return buildWhatsAppUrl(
      number,
      language === 'es'
        ? 'Hola, quiero cotizar un golf cart personalizado.'
        : 'Hi, I want to request a quote for a custom golf cart.',
    )
  }, [language, settings.whatsapp_number])

  const onSubmit = async (values: QuoteFormValues) => {
    setStatus('idle')

    try {
      await submitQuoteRequest(values)
      setStatus('success')
      reset({
        name: '',
        phone: '',
        email: '',
        message: '',
        product_interest: '',
      })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="section-container py-8 sm:py-10">
      <SEO
        title="Contact & Get a Quote"
        description="Contact GF Custom Golf Carts in Fort Worth, TX. Request a quote, ask about custom builds, or reach us via WhatsApp. Fast response guaranteed."
        canonical="/contact"
        jsonLd={buildLocalBusinessJsonLd(settings)}
      />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-surface-300/70 bg-white p-5 shadow-premium sm:p-7">
          <p className="text-xs uppercase tracking-[0.18em] text-accent-gold">{t.contact.eyebrow}</p>
          <h1 className="mt-2 font-display text-3xl text-surface-950 sm:text-4xl">{t.contact.title}</h1>
          <p className="mt-3 text-sm text-surface-700">
            {t.contact.subtitle}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
            <div>
              <Input placeholder={t.contact.fields.name} {...register('name')} />
              {errors.name ? <p className="mt-1 text-xs text-red-300">{errors.name.message}</p> : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Input placeholder={t.contact.fields.phone} {...register('phone')} />
                {errors.phone ? <p className="mt-1 text-xs text-red-300">{errors.phone.message}</p> : null}
              </div>
              <div>
                <Input placeholder={t.contact.fields.email} {...register('email')} />
                {errors.email ? <p className="mt-1 text-xs text-red-300">{errors.email.message}</p> : null}
              </div>
            </div>
            <Input placeholder={t.contact.fields.product} {...register('product_interest')} />
            <div>
              <TextArea placeholder={t.contact.fields.message} {...register('message')} />
              {errors.message ? <p className="mt-1 text-xs text-red-300">{errors.message.message}</p> : null}
            </div>

            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? t.contact.sending : t.contact.submit}
            </Button>

            {status === 'success' ? (
              <p className="text-sm text-emerald-600">{t.contact.success}</p>
            ) : null}
            {status === 'error' ? (
              <p className="text-sm text-red-500">{t.contact.error}</p>
            ) : null}
          </form>
        </section>

        <aside className="space-y-4 rounded-3xl border border-accent-gold/25 bg-gradient-to-b from-surface-900/90 to-accent-emerald/15 p-5 sm:p-7">
          <h2 className="font-display text-2xl text-white">{t.contact.whatsappTitle}</h2>
          <p className="text-sm text-surface-200">
            {t.contact.whatsappBody}
          </p>

          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            <Button size="lg" fullWidth>
              <MessageCircle size={18} className="mr-2" />
              {t.contact.whatsappButton}
            </Button>
          </a>

          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-surface-200">
            <p className="inline-flex items-center gap-2">
              <Phone size={16} className="text-accent-gold" />
              {settings.phone ?? 'Not available'}
            </p>
            <p className="inline-flex items-center gap-2">
              <Mail size={16} className="text-accent-gold" />
              {settings.email ?? 'Not available'}
            </p>
            <p className="inline-flex items-center gap-2">
              <MapPin size={16} className="text-accent-gold" />
              {[settings.address, settings.city, settings.state].filter(Boolean).join(', ') || 'Texas'}
            </p>
            <p className="inline-flex items-center gap-2">
              <Clock3 size={16} className="text-accent-gold" />
              {settings.hours ?? 'Mon - Sat: 9:00 AM - 6:00 PM'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
