import { api } from '@/lib/api'
import { extractErrorMessage } from '@/lib/extract-error-message'

export interface ApiSaleBook {
  id: string
  name: string
}

export interface ApiSale {
  id: string
  city: string
  revenue: number
  soldAt: string
  bookId: string
  book: ApiSaleBook
  createdAt: string
}

export interface ListSalesParams {
  bookId?: string
  city?: string
  search?: string
  page?: number
  limit?: number
}

export interface ListSalesResponse {
  data: ApiSale[]
  meta: { page: number; limit: number; total: number }
}

export interface SalePayload {
  bookId: string
  city: string
  revenue: number
  soldAt: string
}

export async function listSales(params: ListSalesParams = {}): Promise<ListSalesResponse> {
  try {
    const { data } = await api.get<ListSalesResponse>('/sales', { params })
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo cargar el historial de ventas'))
  }
}

export async function createSale(payload: SalePayload): Promise<ApiSale> {
  try {
    const { data } = await api.post<ApiSale>('/sales', payload)
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo registrar la venta'))
  }
}

export async function updateSale(saleId: string, payload: SalePayload): Promise<ApiSale> {
  try {
    const { data } = await api.patch<ApiSale>(`/sales/${saleId}`, payload)
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo actualizar la venta'))
  }
}

export async function deleteSale(saleId: string): Promise<void> {
  try {
    await api.delete(`/sales/${saleId}`)
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo eliminar la venta'))
  }
}
