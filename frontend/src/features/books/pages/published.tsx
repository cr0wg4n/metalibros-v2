import DashboardNav from '@/features/dashboard/components/DashboardNav'
import BookCard from '@/features/books/components/BookCard'
import Pagination from '@/components/ui/Pagination'
import Input from '@/components/ui/Input'
import { usePublishedBooks } from '@/features/books/hooks/use-published-books'
import { resolveCoverUrl } from '@/features/books/services/books-service'

const PAGE_SIZE = 4

function PublishedBooksPage() {
  const { books, page, setPage, totalPages, search, setSearch, debouncedSearch, isLoading, error } =
    usePublishedBooks(PAGE_SIZE)

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

export default PublishedBooksPage
