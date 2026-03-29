import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'

type EmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
  actionTo?: string
}

export function EmptyState({ title, description, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-surface-300/70 bg-white p-8 text-center shadow-premium">
      <h3 className="font-display text-xl text-surface-950">{title}</h3>
      <p className="mt-2 text-sm text-surface-700">{description}</p>
      {actionLabel && actionTo ? (
        <Link to={actionTo} className="mt-5 inline-flex">
          <Button variant="secondary">{actionLabel}</Button>
        </Link>
      ) : null}
    </div>
  )
}
