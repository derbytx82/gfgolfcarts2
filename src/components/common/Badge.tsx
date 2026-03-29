import { cn } from '../../utils/cn'

type BadgeProps = {
  children: string
  tone?: 'default' | 'success' | 'accent'
}

export function Badge({ children, tone = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium',
        tone === 'default' && 'border-surface-300/80 bg-surface-100 text-surface-950',
        tone === 'success' && 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
        tone === 'accent' && 'border-accent-gold/35 bg-accent-gold/10 text-accent-gold',
      )}
    >
      {children}
    </span>
  )
}
