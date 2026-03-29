import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

type ProductGalleryProps = {
  coverImage: string | null
  galleryImages: string[] | null
  productName: string
}

export function ProductGallery({ coverImage, galleryImages, productName }: ProductGalleryProps) {
  const images = useMemo(() => {
    const list = [coverImage, ...(galleryImages ?? [])].filter(Boolean)
    return list.length > 0 ? (list as string[]) : ['https://placehold.co/1000x700?text=GF+Custom+Build']
  }, [coverImage, galleryImages])

  const [activeImage, setActiveImage] = useState(images[0])

  return (
    <div className="space-y-3">
      <motion.div
        layout
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <img src={activeImage} alt={productName} className="aspect-[16/11] w-full object-cover" />
      </motion.div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveImage(image)}
            className={`overflow-hidden rounded-xl border ${
              activeImage === image ? 'border-accent-gold' : 'border-white/10'
            }`}
          >
            <img src={image} alt={productName} className="aspect-[4/3] w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
