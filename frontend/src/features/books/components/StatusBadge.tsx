import type { ApiBookStatus } from '../services/books-service'

interface StatusBadgeProps {
  status: ApiBookStatus
}

const STATUS_LABELS: Record<ApiBookStatus, string> = {
  PUBLISHED: 'Publicado',
  UNPUBLISHED: 'Archivado',
}

function StatusBadge({ status }: StatusBadgeProps) {
  const isPublished = status === 'PUBLISHED'

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-bold ${
        isPublished ? 'bg-success/12 text-success' : 'bg-dark/10 text-muted'
      }`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

export default StatusBadge
