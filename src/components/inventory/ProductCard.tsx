import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import type { Product } from '../../types'
import { formatCurrency } from '../../utils/formatters'
import { Badge } from '../common/Badge'
import { Button } from '../ui/Button'

type ProductCardProps = {
  product: Product
}

function getBadges(product: Product) {
  const flags = [
    product.street_legal ? 'Street Legal' : null,
    product.lithium ? 'Lithium' : null,
    product.lifted ? 'Lifted' : null,
    product.seats ? `${product.seats} Seater` : null,
  ]

  return flags.filter(Boolean) as string[]
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage()
  const badges = product.tags?.length ? product.tags : getBadges(product)

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-2xl border border-surface-300/70 bg-white shadow-premium"
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <img
          src={product.cover_image ?? 'https://placehold.co/1200x800?text=GF+Custom+Golf+Carts'}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950/70 via-transparent to-transparent" />
        <span
          className={`absolute bottom-3 right-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
            product.available ? 'bg-emerald-500/20 text-emerald-200' : 'bg-white/10 text-surface-200'
          }`}
        >
          {product.available ? t.common.available : t.common.buildToOrder}
        </span>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-surface-400">{product.category ?? 'Custom Build'}</p>
          <h3 className="mt-1 font-display text-xl text-surface-950">{product.name}</h3>
          <p className="mt-2 text-sm text-surface-700">{product.short_description ?? 'Premium custom golf cart.'}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {badges.slice(0, 4).map((badge) => (
            <Badge key={badge} tone={badge.includes('Street') ? 'accent' : 'default'}>
              {badge}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-lg text-accent-gold">{formatCurrency(product.price)}</p>
          <div className="flex gap-2">
            <Link to={`/inventory/${product.slug}`}>
              <Button variant="secondary" size="sm">
                {t.common.view}
              </Button>
            </Link>
            <Link to={`/contact?product=${encodeURIComponent(product.name)}`}>
              <Button size="sm">{t.common.quote}</Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
