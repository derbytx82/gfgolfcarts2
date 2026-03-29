import { forwardRef } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement>

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        'h-12 w-full rounded-xl border border-surface-300/70 bg-white px-4 text-sm text-surface-950 placeholder:text-surface-500 focus:border-accent-gold/80 focus:outline-none focus:ring-2 focus:ring-accent-gold/30',
        className,
      )}
      {...props}
    />
  )
})

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { className, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'min-h-[120px] w-full rounded-xl border border-surface-300/70 bg-white px-4 py-3 text-sm text-surface-950 placeholder:text-surface-500 focus:border-accent-gold/80 focus:outline-none focus:ring-2 focus:ring-accent-gold/30',
        className,
      )}
      {...props}
    />
  )
})
