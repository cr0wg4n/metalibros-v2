import { useEffect, useState } from 'react'
import DashboardNav from '../components/DashboardNav'
import BookCard from '@/features/books/components/BookCard'
import Pagination from '@/components/ui/Pagination'
import Input from '@/components/ui/Input'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { listBooks, resolveCoverUrl, type ApiBook } from '@/features/books/services/books-service'

const PAGE_SIZE = 4
const SEARCH_DEBOUNCE_MS = 300

function DashboardBooksPage() {
  const [books, setBooks] = useState<ApiBook[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    listBooks({ status: 'PUBLISHED', page, limit: PAGE_SIZE, search: debouncedSearch || undefined })
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
  }, [page, debouncedSearch])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <section className="w-full pb-8" aria-label="Contenido principal del dashboard">
      <DashboardNav title="Libros Publicados" />

      <div className="flex flex-col gap-6 p-6">
        <Input
          label="Buscar por título o autor"
          id="book-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Ej. Dune, Camus…"
        />

        {isLoading && <p className="text-muted">Cargando libros…</p>}

        {error && (
          <p className="text-red-600" role="alert">
            {error}
          </p>
        )}

        {!isLoading && !error && books.length === 0 && (
          <p className="text-muted">
            {debouncedSearch ? 'No se encontraron libros para tu búsqueda.' : 'Aún no hay libros publicados.'}
          </p>
        )}

        {!isLoading && !error && books.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <BookCard
                key={book.id}
                title={book.name}
                author={book.author}
                description={book.description}
                price={book.sellingPrice}
                imageUrl={resolveCoverUrl(book.coverImage)}
                imageAlt={`${book.name}, portada`}
              />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </section>
  )
}

export default DashboardBooksPage
