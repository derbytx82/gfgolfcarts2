export type SiteContentKey =
  | 'hero'
  | 'brand_intro'
  | 'custom_upgrades'
  | 'why_choose_us'
  | 'about'
  | 'contact'
  | 'final_cta'

export type Product = {
  id: string
  name: string
  slug: string
  short_description: string | null
  full_description: string | null
  price: number | null
  category: string | null
  seats: number | null
  street_legal: boolean
  lithium: boolean
  lifted: boolean
  featured: boolean
  available: boolean
  cover_image: string | null
  gallery_images: string[] | null
  tags: string[] | null
  specs: Record<string, string> | null
  created_at: string
  updated_at: string
}

export type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
}

export type SiteContent = {
  id: string
  section_key: SiteContentKey
  title: string | null
  subtitle: string | null
  body: string | null
  cta_text: string | null
  cta_link: string | null
  image_url: string | null
  updated_at: string
}

export type SiteContentInput = Omit<SiteContent, 'id' | 'updated_at'> & {
  id?: string
}

export type Testimonial = {
  id: string
  name: string
  quote: string
  role: string | null
  avatar_url: string | null
  featured: boolean
  created_at: string
}

export type TestimonialInput = Omit<Testimonial, 'id' | 'created_at'> & {
  id?: string
}

export type GalleryItem = {
  id: string
  title: string
  image_url: string
  sort_order: number
  created_at: string
}

export type GalleryItemInput = Omit<GalleryItem, 'id' | 'created_at'> & {
  id?: string
}

export type SiteSettings = {
  id: string
  business_name: string
  phone: string | null
  whatsapp_number: string | null
  email: string | null
  address: string | null
  city: string | null
  state: string | null
  instagram_url: string | null
  facebook_url: string | null
  hours: string | null
  hero_background: string | null
  updated_at: string
}

export type SiteSettingsInput = Omit<SiteSettings, 'id' | 'updated_at'> & {
  id?: string
}

export type QuoteFormInput = {
  name: string
  phone: string
  email: string
  message: string
  product_interest?: string
}
