import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ProductCard } from '../components/inventory/ProductCard'
import { EmptyState } from '../components/common/EmptyState'
import { SectionHeader } from '../components/common/SectionHeader'
import { SEO } from '../components/seo/SEO'
import { buildBreadcrumbJsonLd } from '../components/seo/jsonLd'
import { Input } from '../components/ui/Input'
import { useLanguage } from '../context/LanguageContext'
import { fallbackProducts } from '../data/fallback'
import { useWhatsAppMessage } from '../hooks/useWhatsAppMessage'
import { getProducts } from '../services/productsService'
import type { Product } from '../types'
import { cn } from '../utils/cn'

const filterOptions = [
  { id: 'street_legal', label: 'Street Legal' },
  { id: 'lifted', label: 'Lifted' },
  { id: 'lithium', label: 'Lithium' },
  { id: '4_seater', label: '4 Seater' },
  { id: '6_seater', label: '6 Seater' },
  { id: 'custom', label: 'Custom' },
  { id: 'available', label: 'Available' },
] as const

type FilterKey = (typeof filterOptions)[number]['id']

export function InventoryPage() {
  const { t, language } = useLanguage()
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterKey[]>([])

  useWhatsAppMessage(
    language === 'es'
      ? 'Hola, quiero información sobre sus golf carts.'
      : 'Hi, I want information about your golf carts.',
    [language],
  )

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getProducts()

        if (response.length > 0) {
          setProducts(response)
        }
      } catch {
        setProducts(fallbackProducts)
      }
    }

    void loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    return products.filter((product) => {
      const text = [
        product.name,
        product.short_description ?? '',
        product.category ?? '',
        ...(product.tags ?? []),
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch = query.length === 0 || text.includes(query)

      const matchesFilters = activeFilters.every((filter) => {
        switch (filter) {
          case 'street_legal':
            return product.street_legal
          case 'lifted':
            return product.lifted
          case 'lithium':
            return product.lithium
          case '4_seater':
            return product.seats === 4
          case '6_seater':
            return product.seats === 6
          case 'custom':
            return (
              product.category?.toLowerCase().includes('custom') ||
              (product.tags ?? []).some((tag) => tag.toLowerCase().includes('custom'))
            )
          case 'available':
            return product.available
          default:
            return true
        }
      })

      return matchesSearch && matchesFilters
    })
  }, [activeFilters, products, search])

  const toggleFilter = (filter: FilterKey) => {
    setActiveFilters((previous) =>
      previous.includes(filter) ? previous.filter((item) => item !== filter) : [...previous, filter],
    )
  }

  return (
    <div className="section-container py-8 sm:py-10">
      <SEO
        title="Golf Cart Inventory"
        description="Browse our full inventory of custom, street-legal, lifted, and lithium golf carts in Fort Worth, TX. Filter by features and find your perfect ride."
        canonical="/inventory"
        jsonLd={buildBreadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Inventory', url: '/inventory' },
        ])}
      />
      <SectionHeader
        eyebrow={t.inventory.eyebrow}
        title={t.inventory.title}
        subtitle={t.inventory.subtitle}
      />

      <div className="mt-6 space-y-4 rounded-2xl border border-surface-300/70 bg-white p-4 shadow-premium sm:p-5">
        <label className="relative block">
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
          <Input
            placeholder={t.inventory.searchPlaceholder}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-11"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map((filter) => {
            const active = activeFilters.includes(filter.id)
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => toggleFilter(filter.id)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold tracking-[0.08em] uppercase transition',
                  active
                    ? 'border-accent-gold/40 bg-accent-gold/15 text-accent-gold'
                    : 'border-surface-300/70 bg-surface-100 text-surface-700',
                )}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title={t.inventory.emptyTitle}
            description={t.inventory.emptyDesc}
            actionLabel={t.inventory.clearFilters}
            actionTo="/inventory"
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
