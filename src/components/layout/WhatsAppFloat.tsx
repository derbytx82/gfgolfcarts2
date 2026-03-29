import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { useWhatsAppContext } from '../../context/WhatsAppContext'
import { env } from '../../lib/env'
import { buildWhatsAppUrl } from '../../utils/whatsapp'

export function WhatsAppFloat() {
  const { settings } = useSiteSettings()
  const { message } = useWhatsAppContext()
  const [hovered, setHovered] = useState(false)

  const whatsappNumber = settings.whatsapp_number || env.whatsappNumber

  const url = useMemo(() => {
    if (!whatsappNumber) {
      return '#'
    }

    return buildWhatsAppUrl(whatsappNumber, message)
  }, [message, whatsappNumber])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-5 right-4 z-40 safe-bottom sm:bottom-6 sm:right-6"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <AnimatePresence>
        {hovered ? (
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            className="mb-2 hidden rounded-lg border border-white/10 bg-surface-900/90 px-3 py-2 text-xs text-white shadow-premium lg:block"
          >
            Chat on WhatsApp
          </motion.div>
        ) : null}
      </AnimatePresence>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[#24D366] text-surface-950 shadow-premium transition hover:scale-[1.03]"
        aria-label="Open WhatsApp chat"
      >
        <MessageCircle size={28} />
      </a>
    </motion.div>
  )
}
