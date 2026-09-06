import { useEffect, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import IconButton from '@/components/ui/IconButton'
import type { ApiBook } from '../services/books-service'

interface StockAdjustDialogProps {
  book: ApiBook | null
  isSaving: boolean
  onConfirm: (quantity: number) => void
  onCancel: () => void
}

function StockAdjustDialog({ book, isSaving, onConfirm, onCancel }: StockAdjustDialogProps) {
  const [quantity, setQuantity] = useState(0)

  useEffect(() => {
    if (book) setQuantity(0)
  }, [book])

  useEffect(() => {
    if (!book) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [book, onCancel])

  if (!book) return null

  const resultingStock = book.stock + quantity
  const isInvalid = resultingStock < 0

  function handleApply() {
    if (quantity === 0 || isInvalid) return
    onConfirm(quantity)
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-dark/40 p-4"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_10px_24px_rgba(51,104,160,0.15)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="stock-dialog-title" className="text-lg font-bold text-primary">
          Ajustar existencias
        </h2>
        <p className="mt-1 text-sm text-muted">
          {book.name}
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <IconButton
            label="Quitar una unidad"
            icon={<Minus className="h-4 w-4" />}
            onClick={() => setQuantity((value) => value - 1)}
            disabled={isSaving}
          />
          <input
            type="number"
            className="w-24 rounded-xl border border-primary bg-white px-3 py-2 text-center text-lg font-semibold text-text focus:outline focus:outline-primary"
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value) || 0)}
            disabled={isSaving}
          />
          <IconButton
            label="Agregar una unidad"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => setQuantity((value) => value + 1)}
            disabled={isSaving}
          />
        </div>

        <div className="mt-3 text-center text-sm text-muted flex gap-4 items-center justify-center">
          <p>
            Stock actual: <span className="font-semibold text-text">{book.stock}</span>
          </p>
          <p>
            Nuevo stock: <span className={isInvalid ? 'font-semibold text-red-600' : 'font-semibold text-text'}>{resultingStock}</span>
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            className="px-4 py-2 text-sm"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="px-4 py-2 text-sm"
            onClick={handleApply}
            disabled={isSaving || quantity === 0 || isInvalid}
          >
            {isSaving ? 'Aplicando…' : 'Aplicar'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StockAdjustDialog
