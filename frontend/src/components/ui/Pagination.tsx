import Button from './Button'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-4 pt-2">
      <Button
        type="button"
        variant="secondary"
        className="px-4 py-2 text-sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </Button>

      <span className="text-sm text-muted">
        Página {page} de {totalPages}
      </span>

      <Button
        type="button"
        variant="secondary"
        className="px-4 py-2 text-sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Siguiente
      </Button>
    </div>
  )
}

export default Pagination
