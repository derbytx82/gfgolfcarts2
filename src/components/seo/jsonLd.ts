import type { Product, SiteSettings } from '../../types'

const SITE_URL = 'https://gfcustomgolfcarts.com'

/**
 * LocalBusiness schema — used on Home, About, Contact pages.
 */
export function buildLocalBusinessJsonLd(settings: SiteSettings): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.business_name || 'GF Custom Golf Carts',
    description: 'Custom and street-legal golf carts in Fort Worth, Texas. Premium upgrades, lithium batteries, lifted builds, and personalized service.',
    url: SITE_URL,
    telephone: settings.phone ?? undefined,
    email: settings.email ?? undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: settings.city ?? 'Fort Worth',
      addressRegion: settings.state ?? 'TX',
      addressCountry: 'US',
      streetAddress: settings.address ?? undefined,
    },
    openingHours: settings.hours ?? 'Mo-Sa 09:00-18:00',
    sameAs: [settings.instagram_url, settings.facebook_url].filter(Boolean),
    image: `${SITE_URL}/og-default.jpg`,
    priceRange: '$$',
  }
}

/**
 * Product schema — used on ProductDetailPage.
 */
export function buildProductJsonLd(product: Product): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.full_description ?? product.short_description ?? '',
    image: product.cover_image ?? undefined,
    url: `${SITE_URL}/inventory/${product.slug}`,
    brand: {
      '@type': 'Brand',
      name: 'GF Custom Golf Carts',
    },
    ...(product.price != null
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: product.price,
            availability: product.available
              ? 'https://schema.org/InStock'
              : 'https://schema.org/PreOrder',
            url: `${SITE_URL}/inventory/${product.slug}`,
          },
        }
      : {}),
    ...(product.category ? { category: product.category } : {}),
  }
}

/**
 * BreadcrumbList schema — used on product & category pages.
 */
export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}

/**
 * WebSite schema — used on HomePage only.
 */
export function buildWebSiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GF Custom Golf Carts',
    url: SITE_URL,
    description: 'Custom and street-legal golf carts in Fort Worth, Texas.',
  }
}
