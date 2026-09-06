import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { listBooks, type ApiBook } from '@/features/books/services/books-service'
import { BOLIVIA_CITIES } from '../constants/cities'
import { saleSchema } from '../schemas/sale-schema'
import type { ApiSale, SalePayload } from '../services/sales-service'

type FieldErrors = Partial<Record<'bookId' | 'city' | 'revenue' | 'soldAt', string>>

interface SaleFormDialogProps {
  isOpen: boolean
  sale: ApiSale | null
  isSaving: boolean
  formError: string | null
  onSubmit: (payload: SalePayload) => void
  onCancel: () => void
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10)
}

function SaleFormDialog({ isOpen, sale, isSaving, formError, onSubmit, onCancel }: SaleFormDialogProps) {
  const [books, setBooks] = useState<ApiBook[]>([])
  const [booksError, setBooksError] = useState<string | null>(null)
  const [bookId, setBookId] = useState('')
  const [city, setCity] = useState('')
  const [revenue, setRevenue] = useState('')
  const [soldAt, setSoldAt] = useState(todayIsoDate())
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  useEffect(() => {
    if (!isOpen) return

    listBooks({ limit: 200 })
      .then((response) => setBooks(response.data))
      .catch(() => setBooksError('No se pudieron cargar los libros'))
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    setFieldErrors({})
    setBookId(sale?.bookId ?? '')
    setCity(sale?.city ?? '')
    setRevenue(sale ? String(sale.revenue) : '')
    setSoldAt(sale ? sale.soldAt.slice(0, 10) : todayIsoDate())
  }, [isOpen, sale])

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  function handleBookChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextBookId = event.target.value
    setBookId(nextBookId)

    const selectedBook = books.find((book) => book.id === nextBookId)
    if (selectedBook) {
      setRevenue(String(selectedBook.sellingPrice))
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const result = saleSchema.safeParse({ bookId, city, revenue, soldAt })
    if (!result.success) {
      const errors: FieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof FieldErrors
        errors[field] = issue.message
      }
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    onSubmit(result.data)
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-dark/40 p-4"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_10px_24px_rgba(51,104,160,0.15)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sale-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="sale-dialog-title" className="text-lg font-bold text-primary">
          {sale ? 'Editar venta' : 'Registrar venta'}
        </h2>

        <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-primary" htmlFor="sale-book">
              Libro
            </label>
            <select
              id="sale-book"
              className={`w-full rounded-xl border bg-white px-4 py-3.5 text-text focus:outline focus:outline-primary ${
                fieldErrors.bookId ? 'border-red-500' : 'border-primary'
              }`}
              value={bookId}
              onChange={handleBookChange}
            >
              <option value="">Selecciona un libro</option>
              {books.map((book) => (
                <option key={book.id} value={book.id} disabled={book.stock <= 0 && book.id !== sale?.bookId}>
                  {book.name} (stock: {book.stock})
                </option>
              ))}
            </select>
            {fieldErrors.bookId && <p className="text-sm text-red-600">{fieldErrors.bookId}</p>}
            {booksError && <p className="text-sm text-red-600">{booksError}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-primary" htmlFor="sale-city">
              Ciudad
            </label>
            <select
              id="sale-city"
              className={`w-full rounded-xl border bg-white px-4 py-3.5 text-text focus:outline focus:outline-primary ${
                fieldErrors.city ? 'border-red-500' : 'border-primary'
              }`}
              value={city}
              onChange={(event) => setCity(event.target.value)}
            >
              <option value="">Selecciona una ciudad</option>
              {BOLIVIA_CITIES.map((cityOption) => (
                <option key={cityOption} value={cityOption}>
                  {cityOption}
                </option>
              ))}
            </select>
            {fieldErrors.city && <p className="text-sm text-red-600">{fieldErrors.city}</p>}
          </div>

          <Input
            label="Ingreso (Bs)"
            id="sale-revenue"
            type="number"
            min="0"
            step="0.01"
            placeholder="Ej. 120"
            value={revenue}
            onChange={(event) => setRevenue(event.target.value)}
            error={fieldErrors.revenue}
          />

          <Input
            label="Fecha de venta"
            id="sale-soldAt"
            type="date"
            value={soldAt}
            onChange={(event) => setSoldAt(event.target.value)}
            error={fieldErrors.soldAt}
          />

          {formError && (
            <p className="text-sm text-red-600" role="alert">
              {formError}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              className="px-4 py-2 text-sm"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button type="submit" className="px-4 py-2 text-sm" disabled={isSaving}>
              {isSaving ? 'Guardando…' : sale ? 'Guardar cambios' : 'Registrar venta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SaleFormDialog
