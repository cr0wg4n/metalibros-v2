import { useEffect, useState } from 'react'
import CentralBanner from '../components/CentralBanner'
import BookCard from '@/features/books/components/BookCard'
import Pagination from '@/components/ui/Pagination'
import Input from '@/components/ui/Input'
import Footer from '@/components/layout/Footer'
import WhatsappBubble from '@/components/common/WhatsappBubble'
import { ROUTES } from '@/config/routes'
import { usePublishedBooks } from '@/features/books/hooks/use-published-books'
import { resolveCoverUrl } from '@/features/books/services/books-service'
import { listCategories, type ApiCategory } from '@/features/books/services/categories-service'

const PAGE_SIZE = 4

function LandingPage() {
  const {
    books,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
    categoryId,
    setCategoryId,
    debouncedSearch,
    isLoading,
    error,
  } = usePublishedBooks(PAGE_SIZE)

  const [categories, setCategories] = useState<ApiCategory[]>([])

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => {})
  }, [])

  return (
    <div className="relative">
      <CentralBanner
        title="Metalibros"
        subtitle="Tu librería digital para descubrir, guardar y comprar tus libros favoritos."
      />

      <section className="flex flex-col gap-6 px-5 pt-8 pb-12" aria-label="Libros publicados">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              label="Buscar por título o autor"
              id="landing-book-search"
              type="search"
              placeholder="Ej. Dune, Camus…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 sm:w-64">
            <label className="font-semibold text-primary" htmlFor="landing-category-filter">
              Categoría
            </label>
            <select
              id="landing-category-filter"
              className="rounded-xl border border-primary bg-white px-4 py-3.5 text-text focus:outline focus:outline-primary"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl">
          {isLoading && <p className="text-muted">Cargando libros…</p>}

          {error && (
            <p className="text-red-600" role="alert">
              {error}
            </p>
          )}

          {!isLoading && !error && books.length === 0 && (
            <p className="text-muted">
              {debouncedSearch || categoryId
                ? 'No se encontraron libros para tu búsqueda.'
                : 'Aún no hay libros publicados.'}
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
                  viewMoreHref={ROUTES.login}
                />
              ))}
            </div>
          )}

          <div className="mt-6">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      </section>

      <Footer />

      <WhatsappBubble />
    </div>
  )
}

export default LandingPage
