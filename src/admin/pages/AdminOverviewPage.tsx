import { Box, ImageIcon, MessageSquareText, PanelsTopLeft, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingState } from '../../components/common/LoadingState'
import { Button } from '../../components/ui/Button'
import { getSiteContentList } from '../../services/contentService'
import { getGalleryItems } from '../../services/galleryService'
import { getProducts } from '../../services/productsService'
import { getTestimonials } from '../../services/testimonialsService'

export function AdminOverviewPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    products: 0,
    contentSections: 0,
    testimonials: 0,
    gallery: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [products, content, testimonials, gallery] = await Promise.all([
          getProducts(),
          getSiteContentList(),
          getTestimonials(),
          getGalleryItems(),
        ])

        setStats({
          products: products.length,
          contentSections: content.length,
          testimonials: testimonials.length,
          gallery: gallery.length,
        })
      } finally {
        setLoading(false)
      }
    }

    void loadStats()
  }, [])

  if (loading) {
    return <LoadingState label="Loading dashboard..." />
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-accent-gold">Dashboard</p>
        <h1 className="mt-1 font-display text-3xl text-white">Admin Overview</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: 'Products', value: stats.products, icon: Box },
          { label: 'Content Sections', value: stats.contentSections, icon: PanelsTopLeft },
          { label: 'Testimonials', value: stats.testimonials, icon: MessageSquareText },
          { label: 'Gallery Items', value: stats.gallery, icon: ImageIcon },
        ].map((item) => {
          const Icon = item.icon
          return (
            <article key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <Icon size={18} className="text-accent-gold" />
              <p className="mt-2 text-xs tracking-[0.12em] text-surface-400">{item.label}</p>
              <p className="mt-1 font-display text-3xl text-white">{item.value}</p>
            </article>
          )
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="font-display text-xl text-white">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/golfpanel/products/new">
            <Button>Add Product</Button>
          </Link>
          <Link to="/golfpanel/content">
            <Button variant="secondary">Edit Content</Button>
          </Link>
          <Link to="/golfpanel/settings">
            <Button variant="secondary">
              <Settings size={16} className="mr-2" />
              Site Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}