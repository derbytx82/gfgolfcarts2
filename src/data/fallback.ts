import type {
  GalleryItem,
  Product,
  SiteContent,
  SiteContentKey,
  SiteSettings,
  Testimonial,
} from '../types'

const now = new Date().toISOString()

export const fallbackProducts: Product[] = [
  {
    id: 'fallback-1',
    name: 'Stealth 4 Seater Street-Legal',
    slug: 'stealth-4-seater-street-legal',
    short_description: 'Premium black build with full street-legal package and lithium range.',
    full_description:
      'A premium-ready cart designed for Texas neighborhoods and golf communities. Includes LED lighting, safety package, upgraded suspension and custom stitched seats.',
    price: 15250,
    category: 'Street-Legal',
    seats: 4,
    street_legal: true,
    lithium: true,
    lifted: true,
    featured: true,
    available: true,
    cover_image:
      'https://images.unsplash.com/photo-1561251224-e393160cd769?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1699135343707-7f1c6dcc49d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599601438065-af12a89792e3?auto=format&fit=crop&w=1200&q=80',
    ],
    tags: ['Street Legal', 'Lithium', 'Lifted', '4 Seater', 'Custom'],
    specs: {
      Battery: '48V Lithium',
      Range: '35-45 miles',
      Wheels: '14” custom alloys',
      Audio: 'Bluetooth premium system',
    },
    created_at: now,
    updated_at: now,
  },
  {
    id: 'fallback-2',
    name: 'Coastal Cruiser 6 Seater',
    slug: 'coastal-cruiser-6-seater',
    short_description: 'Luxury six seater with lifted stance, custom roof and refined interior.',
    full_description:
      'Built for families and resorts. This 6 seater combines comfort and street-ready confidence with upgraded brakes, LED package and premium finishes.',
    price: 17800,
    category: 'Family Build',
    seats: 6,
    street_legal: true,
    lithium: false,
    lifted: true,
    featured: true,
    available: true,
    cover_image:
      'https://images.unsplash.com/photo-1620870426721-9f9e4d11d550?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1646606625592-7d61da12cff0?auto=format&fit=crop&w=1200&q=80',
    ],
    tags: ['Street Legal', '6 Seater', 'Lifted', 'Ready to Ride'],
    specs: {
      Battery: '48V AGM',
      Seats: '6 passenger premium upholstery',
      Lighting: 'Full LED + underglow',
      Brakes: 'Hydraulic upgrade',
    },
    created_at: now,
    updated_at: now,
  },
  {
    id: 'fallback-3',
    name: 'Executive Black Edition',
    slug: 'executive-black-edition',
    short_description: 'Monochrome executive design with premium custom paint and seats.',
    full_description:
      'A statement build designed for clients looking for elevated style and performance. Includes custom wheel package, weatherproof audio and premium trim.',
    price: 16490,
    category: 'Custom Premium',
    seats: 4,
    street_legal: true,
    lithium: true,
    lifted: false,
    featured: false,
    available: false,
    cover_image:
      'https://images.unsplash.com/photo-1664991307596-44cb359c0bea?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [],
    tags: ['Custom', 'Lithium', '4 Seater', 'Premium'],
    specs: {
      Battery: '72V Lithium',
      Paint: 'Satin black ceramic coat',
      Seats: 'Diamond stitch custom seats',
      Lighting: 'Street-Legal package',
    },
    created_at: now,
    updated_at: now,
  },
]

export const fallbackContentMap: Record<SiteContentKey, SiteContent> = {
  hero: {
    id: 'hero',
    section_key: 'hero',
    title: 'Custom & Street-Legal Golf Carts Built to Stand Out',
    subtitle: 'G.F Custom Golf Carts · Fort Worth, TX',
    body: 'Custom & Street-Legal Golf Carts. Upgraded & Ready to Ride for Fort Worth and surrounding Texas communities.',
    cta_text: 'Shop Carts',
    cta_link: '/inventory',
    image_url:
      'https://images.unsplash.com/photo-1699135801906-ad078d7a6e76?auto=format&fit=crop&w=1600&q=80',
    updated_at: now,
  },
  brand_intro: {
    id: 'brand_intro',
    section_key: 'brand_intro',
    title: 'Texas Craft. Premium Custom Builds.',
    subtitle: 'GF Custom Golf Carts',
    body: 'We design, upgrade and deliver golf carts focused on style, reliability and street-ready confidence.',
    cta_text: 'Build Yours',
    cta_link: '/contact',
    image_url: null,
    updated_at: now,
  },
  custom_upgrades: {
    id: 'custom_upgrades',
    section_key: 'custom_upgrades',
    title: 'Upgrades That Matter',
    subtitle: 'Performance + Style',
    body: 'Lithium systems, custom wheels, premium seats, audio, lighting and full street-legal packages.',
    cta_text: 'Request a Quote',
    cta_link: '/contact',
    image_url: null,
    updated_at: now,
  },
  why_choose_us: {
    id: 'why_choose_us',
    section_key: 'why_choose_us',
    title: 'Why GF Custom Golf Carts',
    subtitle: 'Built for confidence',
    body: 'Premium quality, transparent process and customer-first service from first message to final delivery.',
    cta_text: 'Talk to an Expert',
    cta_link: '/contact',
    image_url: null,
    updated_at: now,
  },
  about: {
    id: 'about',
    section_key: 'about',
    title: 'About GF Custom Golf Carts',
    subtitle: 'Custom + Street-Legal Specialists',
    body: 'We serve Texas riders with curated inventory and custom builds designed for neighborhoods, resorts and golf communities.',
    cta_text: 'Learn More',
    cta_link: '/about',
    image_url: null,
    updated_at: now,
  },
  contact: {
    id: 'contact',
    section_key: 'contact',
    title: 'Let’s Build Your Cart',
    subtitle: 'Fast response from our team',
    body: 'Tell us what you need and we will send options tailored to your budget and style.',
    cta_text: 'Send Request',
    cta_link: '/contact',
    image_url: null,
    updated_at: now,
  },
  final_cta: {
    id: 'final_cta',
    section_key: 'final_cta',
    title: 'Ready to Ride in Style?',
    subtitle: 'Inventory + Custom Builds',
    body: 'Shop available carts or request a fully custom build with the GF team.',
    cta_text: 'Request a Quote',
    cta_link: '/contact',
    image_url: null,
    updated_at: now,
  },
}

export const fallbackTestimonials: Testimonial[] = [
  {
    id: 'testimonial-1',
    name: 'Jordan H.',
    quote:
      'The team delivered exactly what we wanted. Premium finish, great communication and street-legal ready.',
    role: 'Homeowner · The Woodlands',
    avatar_url: null,
    featured: true,
    created_at: now,
  },
  {
    id: 'testimonial-2',
    name: 'Mia R.',
    quote: 'Our 6 seater build looks incredible and drives perfectly. The custom options are next level.',
    role: 'Family Client · Houston',
    avatar_url: null,
    featured: true,
    created_at: now,
  },
]

export const fallbackGallery: GalleryItem[] = [
  {
    id: 'gallery-1',
    title: 'Street-Legal Build',
    image_url:
      'https://images.unsplash.com/photo-1707242345543-e4ee3376c4f1?auto=format&fit=crop&w=1400&q=80',
    sort_order: 1,
    created_at: now,
  },
  {
    id: 'gallery-2',
    title: 'Custom Interior',
    image_url:
      'https://images.unsplash.com/photo-1729536716977-a88e5e595bdc?auto=format&fit=crop&w=1400&q=80',
    sort_order: 2,
    created_at: now,
  },
  {
    id: 'gallery-3',
    title: 'Premium Detailing',
    image_url:
      'https://images.unsplash.com/photo-1599601365496-9eb8552242b2?auto=format&fit=crop&w=1400&q=80',
    sort_order: 3,
    created_at: now,
  },
]

export const fallbackSettings: SiteSettings = {
  id: 'settings-1',
  business_name: 'G.F Custom Golf Carts',
  phone: '+1 817-800-1470',
  whatsapp_number: import.meta.env.VITE_WHATSAPP_NUMBER ?? '+18178001470',
  email: 'info@gfcustomgolfcarts.com',
  address: 'Fort Worth',
  city: 'Fort Worth',
  state: 'Texas',
  instagram_url: 'https://instagram.com/gfcustomgolfcarts',
  facebook_url: 'https://facebook.com',
  hours: 'Mon - Sat: 9:00 AM - 6:00 PM',
  hero_background:
    'https://images.unsplash.com/photo-1642530633709-92b766cc02da?auto=format&fit=crop&w=1800&q=80',
  updated_at: now,
}

export const upgradesCatalog = [
  'Lithium Upgrade',
  'Custom Wheels',
  'Diamond Stitch Seats',
  'Premium Audio',
  'LED + Underglow Lighting',
  'Street-Legal Package',
  'Premium Finishes',
  'Custom Colors',
]

export const whyChooseUsItems = [
  {
    title: 'Premium Builds',
    text: 'Every cart is inspected, upgraded and detailed before delivery.',
  },
  {
    title: 'Street-Legal Experts',
    text: 'We know compliance requirements and build for real-world use.',
  },
  {
    title: 'Ready Inventory',
    text: 'Fast options available now, plus complete custom projects.',
  },
  {
    title: 'Personalized Support',
    text: 'Direct guidance from consultation to final handoff.',
  },
]
