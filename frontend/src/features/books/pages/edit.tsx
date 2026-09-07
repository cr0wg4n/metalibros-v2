import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@/components/ui/Button'
import DashboardNav from '@/features/dashboard/components/DashboardNav'
import BookRegisterForm, { type BookRegisterFormValues } from '@/features/books/components/BookRegisterForm'
import DeleteBookDialog from '@/features/books/components/DeleteBookDialog'
import { bookSchema } from '@/features/books/schemas/book-schema'
import {
  deleteBook,
  getBook,
  resolveCoverUrl,
  updateBook,
  uploadBookCover,
} from '@/features/books/services/books-service'
import { ROUTES } from '@/config/routes'
import { useAuthStore } from '@/store/auth-store'

type FieldErrors = Partial<
  Record<'name' | 'author' | 'description' | 'sellingPrice' | 'costPrice' | 'releaseDate', string>
>

function BookEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isInitializing = useAuthStore((state) => state.isInitializing)
  const [initialValues, setInitialValues] = useState<Omit<BookRegisterFormValues, 'coverFile'> | null>(null)
  const [initialCoverUrl, setInitialCoverUrl] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    if (!id || isInitializing) return

    getBook(id)
      .then((book) => {
        setInitialValues({
          name: book.name,
          author: book.author,
          description: book.description,
          sellingPrice: String(book.sellingPrice),
          costPrice: String(book.costPrice),
          releaseDate: book.releaseDate.slice(0, 10),
          categoryIds: book.categories.map((category) => category.id),
        })
        setInitialCoverUrl(resolveCoverUrl(book.coverImage) ?? null)
      })
      .catch(() => setLoadError('No se pudo cargar el libro'))
  }, [id, isInitializing])

  async function handleSubmit(values: BookRegisterFormValues) {
    if (!id) return

    setFormError(null)

    const result = bookSchema.safeParse(values)
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
    setIsSubmitting(true)

    try {
      const { coverFile, ...payload } = result.data
      await updateBook(id, payload)

      if (coverFile) {
        await uploadBookCover(id, coverFile)
      }

      navigate(ROUTES.booksManage)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No se pudo actualizar el libro')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleConfirmDelete() {
    if (!id) return

    setIsDeleting(true)
    setDeleteError(null)

    try {
      await deleteBook(id)
      navigate(ROUTES.booksManage)
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'No se pudo eliminar el libro')
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <section className="w-full pb-8" aria-label="Contenido principal del dashboard">
      <DashboardNav title="Editar libro" />

      <div className="p-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-primary/12 bg-white p-8 shadow-[0_10px_24px_rgba(51,104,160,0.08)]">
          {loadError && (
            <p className="text-red-600" role="alert">
              {loadError}
            </p>
          )}

          {!loadError && !initialValues && <p className="text-muted">Cargando libro…</p>}

          {initialValues && (
            <>
              {deleteError && (
                <p className="mb-4 text-red-600" role="alert">
                  {deleteError}
                </p>
              )}

              <BookRegisterForm
                initialValues={initialValues}
                initialCoverUrl={initialCoverUrl}
                fieldErrors={fieldErrors}
                formError={formError}
                isSubmitting={isSubmitting}
                submitLabel="Guardar cambios"
                extraActions={
                  <Button
                    type="button"
                    variant="danger"
                    className="px-4 py-2 text-sm"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    Eliminar libro
                  </Button>
                }
                onSubmit={handleSubmit}
              />

              <DeleteBookDialog
                bookName={initialValues.name}
                isOpen={isDeleteDialogOpen}
                isDeleting={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteDialogOpen(false)}
              />
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default BookEditPage
