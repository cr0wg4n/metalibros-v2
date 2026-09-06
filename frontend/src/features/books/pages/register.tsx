import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardNav from '@/features/dashboard/components/DashboardNav'
import BookRegisterForm, { type BookRegisterFormValues } from '@/features/books/components/BookRegisterForm'
import { bookSchema } from '@/features/books/schemas/book-schema'
import { createBook, uploadBookCover } from '@/features/books/services/books-service'
import { ROUTES } from '@/config/routes'

type FieldErrors = Partial<
  Record<'name' | 'author' | 'description' | 'sellingPrice' | 'costPrice' | 'releaseDate', string>
>

function BookRegisterPage() {
  const navigate = useNavigate()
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(values: BookRegisterFormValues) {
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
      const book = await createBook(payload)

      if (coverFile) {
        await uploadBookCover(book.id, coverFile)
      }

      navigate(ROUTES.booksPublished)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No se pudo registrar el libro')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="w-full pb-8" aria-label="Contenido principal del dashboard">
      <DashboardNav title="Registro de libros" />

      <div className="p-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-primary/12 bg-white p-8 shadow-[0_10px_24px_rgba(51,104,160,0.08)]">
          <BookRegisterForm
            fieldErrors={fieldErrors}
            formError={formError}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </section>
  )
}

export default BookRegisterPage
