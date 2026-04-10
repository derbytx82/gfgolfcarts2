import { ImagePlus, Plus, Save, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Input, TextArea } from '../../components/ui/Input'
import { Toggle } from '../../components/ui/Toggle'
import { getProductById, saveProduct } from '../../services/productsService'
import { removeImageByPublicUrl, STORAGE_BUCKETS, uploadImage } from '../../services/storageService'
import type { ProductInput } from '../../types'
import { slugify } from '../../utils/slug'

type FormState = {
  name: string
  slug: string
  short_description: string
  full_description: string
  price: string
  category: string
  seats: string
  street_legal: boolean
  lithium: boolean
  lifted: boolean
  featured: boolean
  available: boolean
  cover_image: string | null
}

const emptyForm: FormState = {
  name: '',
  slug: '',
  short_description: '',
  full_description: '',
  price: '',
  category: '',
  seats: '',
  street_legal: true,
  lithium: false,
  lifted: false,
  featured: false,
  available: true,
  cover_image: null,
}

function parseTags(input: string) {
  return input
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function parseSpecs(input: string) {
  return input.split('\n').reduce<Record<string, string>>((acc, row) => {
    const [key, ...rest] = row.split(':')
    const normalizedKey = key?.trim()
    const value = rest.join(':').trim()

    if (normalizedKey && value) {
      acc[normalizedKey] = value
    }

    return acc
  }, {})
}

function formatSpecs(specs: Record<string, string> | null) {
  if (!specs) {
    return ''
  }

  return Object.entries(specs)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
}

type PreviewFile = {
  file: File
  preview: string
}

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const isEdit = Boolean(id)

  const [form, setForm] = useState<FormState>(emptyForm)
  const [tagsText, setTagsText] = useState('')
  const [specsText, setSpecsText] = useState('')
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [newGalleryFiles, setNewGalleryFiles] = useState<PreviewFile[]>([])
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [removedImages, setRemovedImages] = useState<string[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      return
    }

    const loadProduct = async () => {
      try {
        const response = await getProductById(id)

        if (!response) {
          setError('Product not found')
          return
        }

        setForm({
          name: response.name,
          slug: response.slug,
          short_description: response.short_description ?? '',
          full_description: response.full_description ?? '',
          price: response.price?.toString() ?? '',
          category: response.category ?? '',
          seats: response.seats?.toString() ?? '',
          street_legal: response.street_legal,
          lithium: response.lithium,
          lifted: response.lifted,
          featured: response.featured,
          available: response.available,
          cover_image: response.cover_image,
        })
        setCoverPreview(response.cover_image)
        setGalleryImages(response.gallery_images ?? [])
        setTagsText((response.tags ?? []).join(', '))
        setSpecsText(formatSpecs(response.specs))
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load product')
      } finally {
        setLoading(false)
      }
    }

    void loadProduct()
  }, [id])

  const coverImageUrl = useMemo(() => coverPreview || form.cover_image, [coverPreview, form.cover_image])

  const handleChange = (key: keyof FormState, value: string | boolean | null) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  const handleCoverChange = (file: File | null) => {
    if (!file) {
      return
    }

    if (form.cover_image) {
      setRemovedImages((previous) => [...previous, form.cover_image as string])
    }

    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleAddGalleryFiles = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return
    }

    const previews = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setNewGalleryFiles((previous) => [...previous, ...previews])
  }

  const removeExistingGalleryImage = (url: string) => {
    setGalleryImages((previous) => previous.filter((item) => item !== url))
    setRemovedImages((previous) => [...previous, url])
  }

  const removeNewGalleryPreview = (preview: string) => {
    setNewGalleryFiles((previous) => previous.filter((item) => item.preview !== preview))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setError('Product name is required')
      return
    }

    setSaving(true)
    setError(null)

    try {
      let coverImage = form.cover_image

      if (coverFile) {
        coverImage = await uploadImage(coverFile, STORAGE_BUCKETS.products, 'covers')
      }

      const uploadedGalleryUrls: string[] = []
      for (const item of newGalleryFiles) {
        const uploadedUrl = await uploadImage(item.file, STORAGE_BUCKETS.products, 'gallery')
        uploadedGalleryUrls.push(uploadedUrl)
      }

      const payload: ProductInput = {
        id,
        name: form.name.trim(),
        slug: form.slug.trim() ? slugify(form.slug) : slugify(form.name),
        short_description: form.short_description || null,
        full_description: form.full_description || null,
        price: form.price ? Number(form.price) : null,
        category: form.category || null,
        seats: form.seats ? Number(form.seats) : null,
        street_legal: form.street_legal,
        lithium: form.lithium,
        lifted: form.lifted,
        featured: form.featured,
        available: form.available,
        cover_image: coverImage,
        gallery_images: [...galleryImages, ...uploadedGalleryUrls],
        tags: parseTags(tagsText),
        specs: parseSpecs(specsText),
      }

      await saveProduct(payload)

      for (const url of removedImages) {
        await removeImageByPublicUrl(url, STORAGE_BUCKETS.products)
      }

      navigate('/golfpanel/products')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm">Loading product...</div>
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-accent-gold">Admin / Products</p>
          <h1 className="font-display text-3xl text-white">{isEdit ? 'Edit Product' : 'New Product'}</h1>
        </div>
        <Link to="/golfpanel/products">
          <Button variant="secondary">Back</Button>
        </Link>
      </div>

      {error ? <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}

      <form onSubmit={handleSubmit} className="grid gap-5">
        <section className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(event) => handleChange('name', event.target.value)}
            required
          />
          <Input
            placeholder="Slug (optional)"
            value={form.slug}
            onChange={(event) => handleChange('slug', event.target.value)}
          />
          <Input
            placeholder="Price (USD)"
            type="number"
            value={form.price}
            onChange={(event) => handleChange('price', event.target.value)}
          />
          <Input
            placeholder="Category"
            value={form.category}
            onChange={(event) => handleChange('category', event.target.value)}
          />
          <Input
            placeholder="Seats"
            type="number"
            value={form.seats}
            onChange={(event) => handleChange('seats', event.target.value)}
          />
          <Input
            placeholder="Tags (comma separated)"
            value={tagsText}
            onChange={(event) => setTagsText(event.target.value)}
            className="sm:col-span-2"
          />

          <TextArea
            placeholder="Short description"
            value={form.short_description}
            onChange={(event) => handleChange('short_description', event.target.value)}
            className="sm:col-span-2"
          />
          <TextArea
            placeholder="Full description"
            value={form.full_description}
            onChange={(event) => handleChange('full_description', event.target.value)}
            className="sm:col-span-2"
          />
          <TextArea
            placeholder="Specs (format: Key: Value)"
            value={specsText}
            onChange={(event) => setSpecsText(event.target.value)}
            className="sm:col-span-2"
          />
        </section>

        <section className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2 lg:grid-cols-3">
          <Toggle checked={form.street_legal} onChange={(value) => handleChange('street_legal', value)} label="Street Legal" />
          <Toggle checked={form.lithium} onChange={(value) => handleChange('lithium', value)} label="Lithium" />
          <Toggle checked={form.lifted} onChange={(value) => handleChange('lifted', value)} label="Lifted" />
          <Toggle checked={form.featured} onChange={(value) => handleChange('featured', value)} label="Featured" />
          <Toggle checked={form.available} onChange={(value) => handleChange('available', value)} label="Available" />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-display text-xl text-white">Cover Image</h2>
          <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm">
            <ImagePlus size={16} />
            Upload cover
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleCoverChange(event.target.files?.[0] ?? null)}
            />
          </label>
          {coverImageUrl ? (
            <div className="mt-3 relative w-full max-w-sm overflow-hidden rounded-xl border border-white/10">
              <img src={coverImageUrl} alt="Cover preview" className="h-48 w-full object-cover" />
              <button
                type="button"
                onClick={() => {
                  if (form.cover_image) {
                    setRemovedImages((previous) => [...previous, form.cover_image as string])
                  }
                  setCoverFile(null)
                  setCoverPreview(null)
                  setForm((previous) => ({ ...previous, cover_image: null }))
                }}
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface-950/80 text-white"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : null}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="font-display text-xl text-white">Gallery Images</h2>
          <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-2 text-sm">
            <Plus size={16} />
            Add gallery images
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => handleAddGalleryFiles(event.target.files)}
            />
          </label>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {galleryImages.map((image) => (
              <div key={image} className="relative overflow-hidden rounded-xl border border-white/10">
                <img src={image} alt="Gallery" className="h-24 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingGalleryImage(image)}
                  className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface-950/80 text-white"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            {newGalleryFiles.map((item) => (
              <div key={item.preview} className="relative overflow-hidden rounded-xl border border-accent-gold/30">
                <img src={item.preview} alt="New gallery preview" className="h-24 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewGalleryPreview(item.preview)}
                  className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-surface-950/80 text-white"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" size="lg" disabled={saving}>
            <Save size={16} className="mr-2" />
            {saving ? 'Saving...' : 'Save Product'}
          </Button>
          <Link to="/golfpanel/products">
            <Button variant="secondary" size="lg">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
