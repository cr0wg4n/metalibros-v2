import { useEffect, useState } from 'react'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { listBooks, type ApiBook } from '../services/books-service'

const SEARCH_DEBOUNCE_MS = 300

export function usePublishedBooks(pageSize: number) {
  const [books, setBooks] = useState<ApiBook[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, categoryId])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    listBooks({
      status: 'PUBLISHED',
      page,
      limit: pageSize,
      search: debouncedSearch || undefined,
      categoryId: categoryId || undefined,
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
  }, [page, debouncedSearch, categoryId, pageSize])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return {
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
  }
}
