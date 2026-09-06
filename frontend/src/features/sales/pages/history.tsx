import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import DashboardNav from '@/features/dashboard/components/DashboardNav'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Pagination from '@/components/ui/Pagination'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useAuthStore } from '@/store/auth-store'
import SalesTable from '@/features/sales/components/SalesTable'
import SaleFormDialog from '@/features/sales/components/SaleFormDialog'
import DeleteSaleDialog from '@/features/sales/components/DeleteSaleDialog'
import {
  createSale,
  deleteSale,
  listSales,
  updateSale,
  type ApiSale,
  type SalePayload,
} from '@/features/sales/services/sales-service'

const PAGE_SIZE = 7
const SEARCH_DEBOUNCE_MS = 300

function SalesHistoryPage() {
  const isInitializing = useAuthStore((state) => state.isInitializing)
  const [sales, setSales] = useState<ApiSale[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSale, setEditingSale] = useState<ApiSale | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const [deletingSale, setDeletingSale] = useState<ApiSale | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  useEffect(() => {
    if (isInitializing) return

    let cancelled = false
    setIsLoading(true)
    setError(null)

    listSales({ search: debouncedSearch || undefined, page, limit: PAGE_SIZE })
      .then((response) => {
        if (cancelled) return
        setSales(response.data)
        setTotal(response.meta.total)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'No se pudo cargar el historial de ventas')
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [page, debouncedSearch, reloadToken, isInitializing])

  function openCreateDialog() {
    setEditingSale(null)
    setFormError(null)
    setIsFormOpen(true)
  }

  function openEditDialog(sale: ApiSale) {
    setEditingSale(sale)
    setFormError(null)
    setIsFormOpen(true)
  }

  async function handleSubmit(payload: SalePayload) {
    setIsSaving(true)
    setFormError(null)

    try {
      if (editingSale) {
        await updateSale(editingSale.id, payload)
      } else {
        await createSale(payload)
        setPage(1)
      }
      setIsFormOpen(false)
      setReloadToken((token) => token + 1)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'No se pudo guardar la venta')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleConfirmDelete() {
    if (!deletingSale) return

    setIsDeleting(true)
    setError(null)

    try {
      await deleteSale(deletingSale.id)
      setDeletingSale(null)

      if (sales.length === 1 && page > 1) {
        setPage((prev) => prev - 1)
      } else {
        setReloadToken((token) => token + 1)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar la venta')
    } finally {
      setIsDeleting(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <section className="w-full pb-8" aria-label="Contenido principal del dashboard">
      <DashboardNav title="Historial de ventas" />

      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1 sm:max-w-xs">
            <Input
              label="Buscar por ciudad o libro"
              id="sales-search"
              type="search"
              placeholder="Ej. La Paz o Dune"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <Button
            type="button"
            className="flex items-center justify-center gap-2 px-4 py-3.5"
            onClick={openCreateDialog}
          >
            <Plus className="h-4 w-4" />
            Registrar venta
          </Button>
        </div>

        {isLoading && <p className="text-muted">Cargando ventas…</p>}

        {error && (
          <p className="text-red-600" role="alert">
            {error}
          </p>
        )}

        {!isLoading && sales.length === 0 && <p className="text-muted">No se encontraron ventas.</p>}

        {!isLoading && sales.length > 0 && (
          <SalesTable sales={sales} onEdit={openEditDialog} onDelete={setDeletingSale} />
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <SaleFormDialog
        isOpen={isFormOpen}
        sale={editingSale}
        isSaving={isSaving}
        formError={formError}
        onSubmit={handleSubmit}
        onCancel={() => setIsFormOpen(false)}
      />

      <DeleteSaleDialog
        sale={deletingSale}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingSale(null)}
      />
    </section>
  )
}

export default SalesHistoryPage
