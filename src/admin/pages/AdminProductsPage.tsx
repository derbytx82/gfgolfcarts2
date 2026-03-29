import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState } from '../../components/common/LoadingState'
import { Button } from '../../components/ui/Button'
import { deleteProduct, getProducts } from '../../services/productsService'
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
    if (!confirmed) return

    await deleteProduct(id)
    await loadProducts()
  }

  if (loading) return <LoadingState label="Loading products..." />

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
        <div className="mt-6 space-y-4">
          {products.map((product) => (
            <article key={product.id} className="rounded-2xl border border-surface-300/70 bg-white p-5 shadow-premium">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-surface-400">{product.category}</p>
                  <h2 className="font-display text-lg text-white">{product.name}</h2>
                </div>
                <div className="flex items-center gap-2">
                  {product.available ? (
                    <span className="px-2 py-0.5 rounded text-xs bg-emerald-100 text-emerald-800">Available</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-800">Build to Order</span>
                  )}
                  {product.featured && (
                    <span className="px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800 ml-2">Featured</span>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm text-surface-600">{product.short_description ?? ''}</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    product.street_legal && 'Street Legal',
                    product.lifted && 'Lifted',
                    product.lithium && 'Lithium',
                    product.seats && `${product.seats} Seater`,
                  ]
                    .filter((tag): tag is string => typeof tag === 'string')
                    .map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded text-xs bg-white/[0.15] border border-white/20">
                        {tag}
                      </span>
                    ))}
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="text-right space-y-1">
                  <p className="font-display text-lg text-accent-gold">{formatCurrency(product.price)}</p>
                  <p className="text-xs text-surface-500">USD</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/golfpanel/products/${product.id}/edit`}>
                    <Button variant="secondary" size="sm">
                      <Pencil size={14} className="mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500"
                  >
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