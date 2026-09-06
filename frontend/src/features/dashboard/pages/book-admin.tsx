import { useEffect, useState } from 'react'
import DashboardNav from '../components/DashboardNav'
import BookAdminTable from '@/features/books/components/BookAdminTable'
import Pagination from '@/components/ui/Pagination'
import Input from '@/components/ui/Input'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import {
  listBooks,
  updateBookStatus,
  type ApiBook,
  type ApiBookStatus,
} from '@/features/books/services/books-service'

const PAGE_SIZE = 10
const SEARCH_DEBOUNCE_MS = 300

type StatusFilter = ApiBookStatus | 'ALL'

function BookAdminPage() {
  const [books, setBooks] = useState<ApiBook[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [updatingBookId, setUpdatingBookId] = useState<string | null>(null)

  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    listBooks({
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      search: debouncedSearch || undefined,
      page,
      limit: PAGE_SIZE,
    })
      .then((response) => {
        if (cancelled) return
        setBooks(response.data)
        setTotal(response.meta.total)
      })
      .catch(() => {
        if (!cancelled) setError('No se pudieron cargar los libros')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [page, debouncedSearch, statusFilter])

  async function handleToggleStatus(book: ApiBook) {
    const nextStatus: ApiBookStatus = book.status === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED'

    setUpdatingBookId(book.id)
    setError(null)

    try {
      const updated = await updateBookStatus(book.id, nextStatus)
      setBooks((prev) => prev.map((item) => (item.id === book.id ? { ...item, status: updated.status } : item)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el estado del libro')
    } finally {
      setUpdatingBookId(null)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <section className="w-full pb-8" aria-label="Contenido principal del dashboard">
      <DashboardNav title="Administración de libros" />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-primary" htmlFor="status-filter">
              Estado
            </label>
            <select
              id="status-filter"
              className="rounded-xl border border-primary bg-white px-4 py-3.5 text-text focus:outline focus:outline-primary"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            >
              <option value="ALL">Todos</option>
              <option value="PUBLISHED">Publicado</option>
              <option value="UNPUBLISHED">Archivado</option>
            </select>
          </div>

          <div className="flex-1">
            <Input
              label="Buscar"
              id="admin-search"
              type="search"
              placeholder="Buscar título o autor"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {isLoading && <p className="text-muted">Cargando libros…</p>}

        {error && (
          <p className="text-red-600" role="alert">
            {error}
          </p>
        )}

        {!isLoading && books.length === 0 && <p className="text-muted">No se encontraron libros.</p>}

        {!isLoading && books.length > 0 && (
          <BookAdminTable books={books} updatingBookId={updatingBookId} onToggleStatus={handleToggleStatus} />
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </section>
  )
}

export default BookAdminPage
