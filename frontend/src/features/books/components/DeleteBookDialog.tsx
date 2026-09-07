import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface DeleteBookDialogProps {
  bookName: string
  isOpen: boolean
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

function DeleteBookDialog({ bookName, isOpen, isDeleting, onConfirm, onCancel }: DeleteBookDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title={`Eliminar "${bookName}"`}
      description="Esta acción no se puede deshacer y también eliminará el historial de ventas y movimientos de stock de este libro."
      confirmLabel="Eliminar"
      isConfirming={isDeleting}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}

export default DeleteBookDialog
