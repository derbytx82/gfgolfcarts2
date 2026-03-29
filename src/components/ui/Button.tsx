import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-gold text-surface-950 shadow-glow hover:bg-[#b7923f] hover:scale-[1.02] focus-visible:outline-accent-gold/70',
  secondary:
    'border border-surface-300/70 bg-white text-surface-950 shadow-sm hover:border-accent-gold/50 hover:bg-surface-50 focus-visible:outline-surface-300',
  ghost:
    'bg-transparent text-current hover:bg-surface-950/10 focus-visible:outline-surface-700/40',
  danger: 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-300',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-5 text-sm font-semibold',
  lg: 'h-14 px-6 text-base font-semibold',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', fullWidth = false, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-full transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  )
})
