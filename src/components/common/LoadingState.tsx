export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-surface-300/70 bg-white p-8 shadow-premium">
      <div className="flex items-center gap-3 text-surface-700">
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent-gold" />
        <p className="text-sm">{label}</p>
      </div>
    </div>
  )
}
