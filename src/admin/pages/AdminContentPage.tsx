import { ImagePlus, Pencil, Save, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Input, TextArea } from '../../components/ui/Input'
import { Toggle } from '../../components/ui/Toggle'
import { fallbackContentMap, fallbackGallery, fallbackTestimonials } from '../../data/fallback'
import { getSiteContentMap, saveSiteContent } from '../../services/contentService'
import { deleteGalleryItem, getGalleryItems, saveGalleryItem } from '../../services/galleryService'
import { removeImageByPublicUrl, STORAGE_BUCKETS, uploadImage } from '../../services/storageService'
import { deleteTestimonial, getTestimonials, saveTestimonial } from '../../services/testimonialsService'
import type { GalleryItem, SiteContentInput, SiteContentKey, Testimonial } from '../../types'

const contentKeys: SiteContentKey[] = [
  'hero',
  'brand_intro',
  'custom_upgrades',
  'why_choose_us',
  'about',
  'contact',
  'final_cta',
]

type SectionForm = {
  id?: string
  title: string
  subtitle: string
  body: string
  cta_text: string
  cta_link: string
  image_url: string
}

type TestimonialForm = {
  id?: string
  name: string
  quote: string
  role: string
  featured: boolean
  avatar_url: string
}

type GalleryForm = {
  id?: string
  title: string
  image_url: string
  sort_order: string
}

function toSectionForm(key: SiteContentKey): SectionForm {
  const source = fallbackContentMap[key]
  return {
    id: source.id,
    title: source.title ?? '',
    subtitle: source.subtitle ?? '',
    body: source.body ?? '',
    cta_text: source.cta_text ?? '',
    cta_link: source.cta_link ?? '',
    image_url: source.image_url ?? '',
  }
}

export function AdminContentPage() {
  const [sections, setSections] = useState<Record<SiteContentKey, SectionForm>>(() =>
    contentKeys.reduce<Record<SiteContentKey, SectionForm>>((acc, key) => {
      acc[key] = toSectionForm(key)
      return acc
    }, {} as Record<SiteContentKey, SectionForm>),
  )
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials)
  const [gallery, setGallery] = useState<GalleryItem[]>(fallbackGallery)
  const [testimonialForm, setTestimonialForm] = useState<TestimonialForm>({
    name: '',
    quote: '',
    role: '',
    featured: false,
    avatar_url: '',
  })
  const [galleryForm, setGalleryForm] = useState<GalleryForm>({
    title: '',
    image_url: '',
    sort_order: '1',
  })
  const [sectionSaving, setSectionSaving] = useState<SiteContentKey | null>(null)
  const [savingTestimonial, setSavingTestimonial] = useState(false)
  const [savingGallery, setSavingGallery] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const sortedGallery = useMemo(
    () => [...gallery].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [gallery],
  )

  const loadData = async () => {
    try {
      const [contentResponse, testimonialResponse, galleryResponse] = await Promise.all([
        getSiteContentMap(),
        getTestimonials(),
        getGalleryItems(),
      ])

      if (Object.keys(contentResponse).length > 0) {
        setSections((previous) => {
          const next = { ...previous }

          for (const key of contentKeys) {
            const responseSection = contentResponse[key]

            if (responseSection) {
              next[key] = {
                id: responseSection.id,
                title: responseSection.title ?? '',
                subtitle: responseSection.subtitle ?? '',
                body: responseSection.body ?? '',
                cta_text: responseSection.cta_text ?? '',
                cta_link: responseSection.cta_link ?? '',
                image_url: responseSection.image_url ?? '',
              }
            }
          }

          return next
        })
      }

      if (testimonialResponse.length > 0) {
        setTestimonials(testimonialResponse)
      }

      if (galleryResponse.length > 0) {
        setGallery(galleryResponse)
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load content')
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  const updateSection = (key: SiteContentKey, field: keyof SectionForm, value: string) => {
    setSections((previous) => ({
      ...previous,
      [key]: {
        ...previous[key],
        [field]: value,
      },
    }))
  }

  const saveSection = async (key: SiteContentKey) => {
    setSectionSaving(key)
    setError(null)
    setSuccess(null)

    try {
      const section = sections[key]

      const payload: SiteContentInput = {
        id: section.id,
        section_key: key,
        title: section.title || null,
        subtitle: section.subtitle || null,
        body: section.body || null,
        cta_text: section.cta_text || null,
        cta_link: section.cta_link || null,
        image_url: section.image_url || null,
      }

      const saved = await saveSiteContent(payload)

      setSections((previous) => ({
        ...previous,
        [key]: {
          ...previous[key],
          id: saved.id,
        },
      }))
      setSuccess(`${key} updated`) 
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save section')
    } finally {
      setSectionSaving(null)
    }
  }

  const saveTestimonialEntry = async () => {
    if (!testimonialForm.name.trim() || !testimonialForm.quote.trim()) {
      setError('Name and quote are required for testimonial')
      return
    }

    setSavingTestimonial(true)
    setError(null)
    setSuccess(null)

    try {
      await saveTestimonial({
        id: testimonialForm.id,
        name: testimonialForm.name,
        quote: testimonialForm.quote,
        role: testimonialForm.role || null,
        featured: testimonialForm.featured,
        avatar_url: testimonialForm.avatar_url || null,
      })

      setSuccess('Testimonial saved')
      setTestimonialForm({ name: '', quote: '', role: '', featured: false, avatar_url: '' })
      await loadData()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save testimonial')
    } finally {
      setSavingTestimonial(false)
    }
  }

  const editTestimonial = (testimonial: Testimonial) => {
    setTestimonialForm({
      id: testimonial.id,
      name: testimonial.name,
      quote: testimonial.quote,
      role: testimonial.role ?? '',
      featured: testimonial.featured,
      avatar_url: testimonial.avatar_url ?? '',
    })
  }

  const removeTestimonial = async (testimonial: Testimonial) => {
    const confirmed = window.confirm('Delete testimonial?')

    if (!confirmed) {
      return
    }

    await deleteTestimonial(testimonial.id)

    if (testimonial.avatar_url) {
      await removeImageByPublicUrl(testimonial.avatar_url, STORAGE_BUCKETS.testimonials)
    }

    await loadData()
  }

  const saveGalleryEntry = async () => {
    if (!galleryForm.title.trim() || !galleryForm.image_url.trim()) {
      setError('Gallery title and image are required')
      return
    }

    setSavingGallery(true)
    setError(null)
    setSuccess(null)

    try {
      await saveGalleryItem({
        id: galleryForm.id,
        title: galleryForm.title,
        image_url: galleryForm.image_url,
        sort_order: Number(galleryForm.sort_order || '0'),
      })

      setSuccess('Gallery item saved')
      setGalleryForm({ title: '', image_url: '', sort_order: '1' })
      await loadData()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save gallery item')
    } finally {
      setSavingGallery(false)
    }
  }

  const editGallery = (item: GalleryItem) => {
    setGalleryForm({
      id: item.id,
      title: item.title,
      image_url: item.image_url,
      sort_order: item.sort_order.toString(),
    })
  }

  const removeGallery = async (item: GalleryItem) => {
    const confirmed = window.confirm('Delete gallery item?')

    if (!confirmed) {
      return
    }

    await deleteGalleryItem(item.id)
    await removeImageByPublicUrl(item.image_url, STORAGE_BUCKETS.gallery)
    await loadData()
  }

  const uploadSectionImage = async (key: SiteContentKey, file: File | null) => {
    if (!file) {
      return
    }

    const url = await uploadImage(file, STORAGE_BUCKETS.site, `sections/${key}`)
    updateSection(key, 'image_url', url)
  }

  const uploadTestimonialAvatar = async (file: File | null) => {
    if (!file) {
      return
    }

    const url = await uploadImage(file, STORAGE_BUCKETS.testimonials, 'avatars')
    setTestimonialForm((previous) => ({ ...previous, avatar_url: url }))
  }

  const uploadGalleryImage = async (file: File | null) => {
    if (!file) {
      return
    }

    const url = await uploadImage(file, STORAGE_BUCKETS.gallery, 'items')
    setGalleryForm((previous) => ({ ...previous, image_url: url }))
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-accent-gold">Admin / Content</p>
        <h1 className="font-display text-3xl text-white">Site Content</h1>
      </div>

      {error ? <p className="rounded-xl bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}
      {success ? <p className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-300">{success}</p> : null}

      <section className="space-y-4">
        {contentKeys.map((key) => {
          const section = sections[key]

          return (
            <article key={key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-2xl text-white">{key}</h2>
                <Button size="sm" onClick={() => void saveSection(key)} disabled={sectionSaving === key}>
                  <Save size={14} className="mr-2" />
                  {sectionSaving === key ? 'Saving...' : 'Save Section'}
                </Button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Input
                  placeholder="Title"
                  value={section.title}
                  onChange={(event) => updateSection(key, 'title', event.target.value)}
                />
                <Input
                  placeholder="Subtitle"
                  value={section.subtitle}
                  onChange={(event) => updateSection(key, 'subtitle', event.target.value)}
                />
                <Input
                  placeholder="CTA text"
                  value={section.cta_text}
                  onChange={(event) => updateSection(key, 'cta_text', event.target.value)}
                />
                <Input
                  placeholder="CTA link"
                  value={section.cta_link}
                  onChange={(event) => updateSection(key, 'cta_link', event.target.value)}
                />
                <Input
                  placeholder="Image URL"
                  value={section.image_url}
                  onChange={(event) => updateSection(key, 'image_url', event.target.value)}
                  className="sm:col-span-2"
                />
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2 text-sm sm:col-span-2">
                  <ImagePlus size={14} />
                  Upload image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      void uploadSectionImage(key, event.target.files?.[0] ?? null)
                    }}
                  />
                </label>
                <TextArea
                  placeholder="Body"
                  value={section.body}
                  onChange={(event) => updateSection(key, 'body', event.target.value)}
                  className="sm:col-span-2"
                />
              </div>
            </article>
          )
        })}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="font-display text-2xl text-white">Testimonials</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Input
            placeholder="Name"
            value={testimonialForm.name}
            onChange={(event) => setTestimonialForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <Input
            placeholder="Role"
            value={testimonialForm.role}
            onChange={(event) => setTestimonialForm((prev) => ({ ...prev, role: event.target.value }))}
          />
          <Input
            placeholder="Avatar URL"
            value={testimonialForm.avatar_url}
            onChange={(event) => setTestimonialForm((prev) => ({ ...prev, avatar_url: event.target.value }))}
            className="sm:col-span-2"
          />
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2 text-sm sm:col-span-2">
            <ImagePlus size={14} />
            Upload avatar
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                void uploadTestimonialAvatar(event.target.files?.[0] ?? null)
              }}
            />
          </label>
          <TextArea
            placeholder="Quote"
            value={testimonialForm.quote}
            onChange={(event) => setTestimonialForm((prev) => ({ ...prev, quote: event.target.value }))}
            className="sm:col-span-2"
          />
          <Toggle
            label="Featured"
            checked={testimonialForm.featured}
            onChange={(value) => setTestimonialForm((prev) => ({ ...prev, featured: value }))}
          />
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={() => void saveTestimonialEntry()} disabled={savingTestimonial}>
            {savingTestimonial ? 'Saving...' : 'Save Testimonial'}
          </Button>
          {testimonialForm.id ? (
            <Button
              variant="secondary"
              onClick={() => setTestimonialForm({ name: '', quote: '', role: '', featured: false, avatar_url: '' })}
            >
              Cancel Edit
            </Button>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3">
          {testimonials.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <p className="font-semibold text-white">{item.name}</p>
              <p className="text-xs text-surface-400">{item.role}</p>
              <p className="mt-2 text-sm text-surface-200">{item.quote}</p>
              <div className="mt-3 flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => editTestimonial(item)}>
                  <Pencil size={14} className="mr-1" />
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => void removeTestimonial(item)}>
                  <Trash2 size={14} className="mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="font-display text-2xl text-white">Gallery</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Input
            placeholder="Title"
            value={galleryForm.title}
            onChange={(event) => setGalleryForm((prev) => ({ ...prev, title: event.target.value }))}
          />
          <Input
            placeholder="Sort order"
            type="number"
            value={galleryForm.sort_order}
            onChange={(event) => setGalleryForm((prev) => ({ ...prev, sort_order: event.target.value }))}
          />
          <Input
            placeholder="Image URL"
            value={galleryForm.image_url}
            onChange={(event) => setGalleryForm((prev) => ({ ...prev, image_url: event.target.value }))}
            className="sm:col-span-2"
          />
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2 text-sm sm:col-span-2">
            <ImagePlus size={14} />
            Upload gallery image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                void uploadGalleryImage(event.target.files?.[0] ?? null)
              }}
            />
          </label>
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={() => void saveGalleryEntry()} disabled={savingGallery}>
            {savingGallery ? 'Saving...' : 'Save Gallery Item'}
          </Button>
          {galleryForm.id ? (
            <Button variant="secondary" onClick={() => setGalleryForm({ title: '', image_url: '', sort_order: '1' })}>
              Cancel Edit
            </Button>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {sortedGallery.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <img src={item.image_url} alt={item.title} className="h-32 w-full rounded-lg object-cover" />
              <p className="mt-2 font-semibold text-white">{item.title}</p>
              <p className="text-xs text-surface-400">Order: {item.sort_order}</p>
              <div className="mt-3 flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => editGallery(item)}>
                  <Pencil size={14} className="mr-1" />
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => void removeGallery(item)}>
                  <Trash2 size={14} className="mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
