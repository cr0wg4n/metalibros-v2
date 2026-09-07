import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Archive, ArchiveRestore, Diff, Pencil, Trash2 } from 'lucide-react'
import IconButton from '@/components/ui/IconButton'
import { iconButtonClassName } from '@/lib/icon-button-class'
import StatusBadge from './StatusBadge'
import DeleteBookDialog from './DeleteBookDialog'
import StockAdjustDialog from './StockAdjustDialog'
import { bookEditRoute } from '@/config/routes'
import type { ApiBook } from '../services/books-service'

interface BookAdminRowProps {
  book: ApiBook
  isUpdating: boolean
  isDeleting: boolean
  isAdjustingStock: boolean
  onToggleStatus: (book: ApiBook) => void
  onDelete: (book: ApiBook) => void
  onAdjustStock: (book: ApiBook, quantity: number) => void
}

function BookAdminRow({
  book,
  isUpdating,
  isDeleting,
  isAdjustingStock,
  onToggleStatus,
  onDelete,
  onAdjustStock,
}: BookAdminRowProps) {
  const isPublished = book.status === 'PUBLISHED'
  const releaseYear = new Date(book.releaseDate).getFullYear()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false)
  const wasDeleting = useRef(false)
  const wasAdjustingStock = useRef(false)

  useEffect(() => {
    if (isDeleting) {
      wasDeleting.current = true
    } else if (wasDeleting.current) {
      wasDeleting.current = false
      setIsDeleteDialogOpen(false)
    }
  }, [isDeleting])

  useEffect(() => {
    if (isAdjustingStock) {
      wasAdjustingStock.current = true
    } else if (wasAdjustingStock.current) {
      wasAdjustingStock.current = false
      setIsStockDialogOpen(false)
    }
  }, [isAdjustingStock])

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
        <div className="flex flex-wrap gap-2">
          <IconButton
            label={isPublished ? 'Archivar' : 'Publicar'}
            icon={isPublished ? <Archive className="h-4 w-4" /> : <ArchiveRestore className="h-4 w-4" />}
            disabled={isUpdating}
            onClick={() => onToggleStatus(book)}
          />
          <IconButton
            label="Ajustar existencias"
            icon={<Diff className="h-4 w-4" />}
            disabled={isAdjustingStock}
            onClick={() => setIsStockDialogOpen(true)}
          />
          <Link to={bookEditRoute(book.id)} title="Editar" aria-label="Editar" className={iconButtonClassName()}>
            <Pencil className="h-4 w-4" />
          </Link>
          <IconButton
            label="Eliminar"
            icon={<Trash2 className="h-4 w-4" />}
            variant="danger"
            disabled={isDeleting}
            onClick={() => setIsDeleteDialogOpen(true)}
          />
        </div>

        <DeleteBookDialog
          bookName={book.name}
          isOpen={isDeleteDialogOpen}
          isDeleting={isDeleting}
          onConfirm={() => onDelete(book)}
          onCancel={() => setIsDeleteDialogOpen(false)}
        />

        <StockAdjustDialog
          book={isStockDialogOpen ? book : null}
          isSaving={isAdjustingStock}
          onConfirm={(quantity) => onAdjustStock(book, quantity)}
          onCancel={() => setIsStockDialogOpen(false)}
        />
      </td>
    </tr>
  )
}

export default BookAdminRow
