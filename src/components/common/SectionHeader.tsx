import { motion } from 'framer-motion'
import { fadeInUp } from '../../utils/motion'

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
}

export function SectionHeader({ eyebrow, title, subtitle, align = 'left' }: SectionHeaderProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      {eyebrow ? (
        <p className="mb-3 inline-flex rounded-full border border-accent-gold/35 bg-accent-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent-gold">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-3xl leading-tight text-surface-950 sm:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-sm leading-relaxed text-surface-700 sm:text-base">{subtitle}</p> : null}
    </motion.div>
  )
}
