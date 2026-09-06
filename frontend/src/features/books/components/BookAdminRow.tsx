import Button from '@/components/ui/Button'
import StatusBadge from './StatusBadge'
import type { ApiBook } from '../services/books-service'

interface BookAdminRowProps {
  book: ApiBook
  isUpdating: boolean
  onToggleStatus: (book: ApiBook) => void
}

function BookAdminRow({ book, isUpdating, onToggleStatus }: BookAdminRowProps) {
  const isPublished = book.status === 'PUBLISHED'
  const releaseYear = new Date(book.releaseDate).getFullYear()

  return (
    <tr className="border-b border-primary/10 last:border-b-0 hover:bg-secondary/5">
      <td className="px-4 py-3">
        <StatusBadge status={book.status} />
      </td>
      <td className="px-4 py-3 font-medium whitespace-nowrap text-text">{book.name}</td>
      <td className="px-4 py-3 whitespace-nowrap text-muted">{book.author}</td>
      <td className="px-4 py-3 whitespace-nowrap text-muted">Bs {book.sellingPrice}</td>
      <td className="px-4 py-3 whitespace-nowrap text-muted">{releaseYear}</td>
      <td className="px-4 py-3 whitespace-nowrap text-muted">{book.stock}</td>
      <td className="px-4 py-3">
        <Button
          type="button"
          variant="secondary"
          className="px-3 py-1.5 text-xs"
          disabled={isUpdating}
          onClick={() => onToggleStatus(book)}
        >
          {isPublished ? 'Archivar' : 'Publicar'}
        </Button>
      </td>
    </tr>
  )
}

export default BookAdminRow
