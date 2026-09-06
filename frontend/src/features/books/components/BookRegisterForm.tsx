import { useEffect, useState, type ReactNode, type SubmitEvent } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import CategoryPicker from './CategoryPicker'

export interface BookRegisterFormValues {
  name: string
  author: string
  description: string
  sellingPrice: string
  costPrice: string
  releaseDate: string
  categoryIds: string[]
  coverFile: File | null
}

type FieldErrors = Partial<
  Record<'name' | 'author' | 'description' | 'sellingPrice' | 'costPrice' | 'releaseDate', string>
>

interface BookRegisterFormProps {
  initialValues?: Omit<BookRegisterFormValues, 'coverFile'>
  initialCoverUrl?: string | null
  fieldErrors?: FieldErrors
  formError?: string | null
  isSubmitting?: boolean
  submitLabel?: string
  extraActions?: ReactNode
  onSubmit: (values: BookRegisterFormValues) => void
}

function BookRegisterForm({
  initialValues,
  initialCoverUrl = null,
  fieldErrors = {},
  formError,
  isSubmitting = false,
  submitLabel = 'Guardar libro',
  extraActions,
  onSubmit,
}: BookRegisterFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [author, setAuthor] = useState(initialValues?.author ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [sellingPrice, setSellingPrice] = useState(initialValues?.sellingPrice ?? '')
  const [costPrice, setCostPrice] = useState(initialValues?.costPrice ?? '')
  const [releaseDate, setReleaseDate] = useState(initialValues?.releaseDate ?? '')
  const [categoryIds, setCategoryIds] = useState<string[]>(initialValues?.categoryIds ?? [])
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!coverFile) {
      setCoverPreviewUrl(null)
      return
    }

    const url = URL.createObjectURL(coverFile)
    setCoverPreviewUrl(url)

    return () => URL.revokeObjectURL(url)
  }, [coverFile])

  const displayedCoverUrl = coverPreviewUrl ?? initialCoverUrl

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ name, author, description, sellingPrice, costPrice, releaseDate, categoryIds, coverFile })
  }

  return (
    <form className="grid grid-cols-1 gap-5 sm:grid-cols-2" onSubmit={handleSubmit} noValidate>
      <Input
        label="Título"
        id="name"
        placeholder="Ej. Dune"
        value={name}
        onChange={(event) => setName(event.target.value)}
        error={fieldErrors.name}
      />

      <Input
        label="Autor"
        id="author"
        placeholder="Ej. Frank Herbert"
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
        error={fieldErrors.author}
      />

      <Input
        label="Precio de venta (Bs)"
        id="sellingPrice"
        type="number"
        min="0"
        step="0.01"
        placeholder="Ej. 120"
        value={sellingPrice}
        onChange={(event) => setSellingPrice(event.target.value)}
        error={fieldErrors.sellingPrice}
      />

      <Input
        label="Precio real (Bs)"
        id="costPrice"
        type="number"
        min="0"
        step="0.01"
        placeholder="Ej. 70"
        value={costPrice}
        onChange={(event) => setCostPrice(event.target.value)}
        error={fieldErrors.costPrice}
      />

      <Input
        label="Fecha de lanzamiento"
        id="releaseDate"
        type="date"
        value={releaseDate}
        onChange={(event) => setReleaseDate(event.target.value)}
        error={fieldErrors.releaseDate}
      />

      <div className="flex flex-col gap-2">
        <label className="font-semibold text-primary" htmlFor="cover">
          Imagen de portada
        </label>
        <div className="flex items-center gap-3">
          {displayedCoverUrl ? (
            <img
              src={displayedCoverUrl}
              alt="Vista previa de la portada"
              className="h-20 w-20 rounded-lg border border-primary/20 object-cover"
            />
          ) : (
            <div className="flex size-20 min-w-20 min-h-20 items-center justify-center rounded-lg border border-dashed border-primary/30 text-center text-xs text-muted">
              Sin imagen
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="cover"
              className="inline-flex w-fit cursor-pointer items-center justify-center rounded-xl border border-primary bg-white px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
            >
              Seleccionar imagen
            </label>
            <span className="text-xs text-muted">{coverFile ? coverFile.name : 'Ningún archivo seleccionado'}</span>
            <input
              id="cover"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)}
              className="hidden"
            />
          </div>
        </div>
      </div>

      <div className="sm:col-span-2">
        <Textarea
          label="Descripción"
          id="description"
          rows={3}
          placeholder="Escribe una breve descripción del libro…"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          error={fieldErrors.description}
        />
      </div>

      <div className="sm:col-span-2">
        <CategoryPicker value={categoryIds} onChange={setCategoryIds} />
      </div>

      {formError && (
        <p className="text-sm text-red-600 sm:col-span-2" role="alert">
          {formError}
        </p>
      )}

      <div className="flex items-center justify-between sm:col-span-2">
        <div>{extraActions}</div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default BookRegisterForm
