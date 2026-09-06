import BookAdminRow from './BookAdminRow'
import type { ApiBook } from '../services/books-service'

interface BookAdminTableProps {
  books: ApiBook[]
  updatingBookId: string | null
  onToggleStatus: (book: ApiBook) => void
}

function BookAdminTable({ books, updatingBookId, onToggleStatus }: BookAdminTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-primary/12 bg-white shadow-[0_10px_24px_rgba(51,104,160,0.08)]">
      <table className="w-full min-w-175 border-collapse">
        <thead>
          <tr className="bg-primary/8 text-left text-xs font-bold tracking-wide text-primary uppercase">
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Título</th>
            <th className="px-4 py-3">Autor</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3">Año</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <BookAdminRow
              key={book.id}
              book={book}
              isUpdating={updatingBookId === book.id}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BookAdminTable
