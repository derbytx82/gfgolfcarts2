import { Plus, Pencil, Trash2, Star, CircleCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState } from '../../components/common/LoadingState'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/ui/Button'
import { deleteProduct, getProducts, saveProduct } from '../../services/productsService'
import type { Product } from '../../types'
import { formatCurrency } from '../../utils/formatters'

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = async () => {
    try {
      const response = await getProducts()
      setProducts(response)
      setError(null)
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadProducts()
  }, [])

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this product?')

    if (!confirmed) {
      return
    }

    await deleteProduct(id)
    await loadProducts()
  }

  const toggleFlag = async (product: Product, field: 'featured' | 'available') => {
    await saveProduct({
      ...product,
      [field]: !product[field],
    })
    await loadProducts()
  }

  if (loading) {
    return <LoadingState label="Loading products..." />
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-accent-gold">Admin</p>
          <h1 className="font-display text-3xl text-white">Products</h1>
        </div>
        <Link to="/golfpanel/products/new">
          <Button>
            <Plus size={16} className="mr-2" />
            New Product
          </Button>
        </Link>
      </div>

      {error ? <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}

      {products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Create your first inventory item."
          actionLabel="Create Product"
          actionTo="/golfpanel/products/new"
        />
      ) : (
        <div className="grid gap-3">
          {products.map((product) => (
            <article key={product.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-surface-400">{product.category ?? 'Custom'}</p>
                  <h2 className="font-display text-xl text-white">{product.name}</h2>
                  <p className="mt-1 text-sm text-surface-300">{product.short_description}</p>
                  <p className="mt-2 text-sm font-semibold text-accent-gold">{formatCurrency(product.price)}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.featured ? <Badge tone="accent">Featured</Badge> : null}
                    {product.available ? <Badge tone="success">Available</Badge> : <Badge>Build to Order</Badge>}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="ghost" size="sm" onClick={() => void toggleFlag(product, 'featured')}>
                    <Star size={14} className="mr-1" />
                    {product.featured ? 'Unfeature' : 'Feature'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => void toggleFlag(product, 'available')}>
                    <CircleCheck size={14} className="mr-1" />
                    {product.available ? 'Mark Unavailable' : 'Mark Available'}
                  </Button>
                  <Link to={`/golfpanel/products/${product.id}/edit`}>
                    <Button variant="secondary" size="sm">
                      <Pencil size={14} className="mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => void handleDelete(product.id)}>
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
