import ConfirmDialog from '@/components/ui/ConfirmDialog'
import type { ApiSale } from '../services/sales-service'

interface DeleteSaleDialogProps {
  sale: ApiSale | null
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

function DeleteSaleDialog({ sale, isDeleting, onConfirm, onCancel }: DeleteSaleDialogProps) {
  return (
    <ConfirmDialog
      isOpen={sale !== null}
      title="Eliminar venta"
      description={
        sale
          ? `Esta acción no se puede deshacer y devolverá 1 unidad al stock de "${sale.book.name}".`
          : ''
      }
      confirmLabel="Eliminar"
      isConfirming={isDeleting}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}

export default DeleteSaleDialog
