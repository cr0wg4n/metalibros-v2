import { Pencil, Trash2 } from 'lucide-react'
import IconButton from '@/components/ui/IconButton'
import type { ApiSale } from '../services/sales-service'

interface SalesTableRowProps {
  sale: ApiSale
  onEdit: (sale: ApiSale) => void
  onDelete: (sale: ApiSale) => void
}

function SalesTableRow({ sale, onEdit, onDelete }: SalesTableRowProps) {
  const soldAtLabel = new Date(sale.soldAt).toLocaleDateString('es-BO', { timeZone: 'UTC' })

  return (
    <tr className="border-b border-primary/10 last:border-b-0 hover:bg-secondary/5">
      <td className="px-4 py-3 whitespace-nowrap text-muted">{soldAtLabel}</td>
      <td className="px-4 py-3 font-medium whitespace-nowrap text-text">{sale.book.name}</td>
      <td className="px-4 py-3 whitespace-nowrap text-muted">{sale.city}</td>
      <td className="px-4 py-3 whitespace-nowrap text-muted">Bs {sale.revenue}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <IconButton label="Editar" icon={<Pencil className="h-4 w-4" />} onClick={() => onEdit(sale)} />
          <IconButton
            label="Eliminar"
            icon={<Trash2 className="h-4 w-4" />}
            variant="danger"
            onClick={() => onDelete(sale)}
          />
        </div>
      </td>
    </tr>
  )
}

export default SalesTableRow
