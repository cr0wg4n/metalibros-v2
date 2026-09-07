import SalesTableRow from './SalesTableRow'
import type { ApiSale } from '../services/sales-service'

interface SalesTableProps {
  sales: ApiSale[]
  onEdit: (sale: ApiSale) => void
  onDelete: (sale: ApiSale) => void
}

function SalesTable({ sales, onEdit, onDelete }: SalesTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-primary/12 bg-white shadow-[0_10px_24px_rgba(51,104,160,0.08)]">
      <table className="w-full min-w-175 border-collapse">
        <thead>
          <tr className="bg-primary/8 text-left text-xs font-bold tracking-wide text-primary uppercase">
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Libro</th>
            <th className="px-4 py-3">Ciudad</th>
            <th className="px-4 py-3">Ingreso</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <SalesTableRow key={sale.id} sale={sale} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SalesTable
