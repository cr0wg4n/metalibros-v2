import { api } from '@/lib/api'
import { extractErrorMessage } from '@/lib/extract-error-message'

export interface ApiCategory {
  id: string
  name: string
}

export async function listCategories(): Promise<ApiCategory[]> {
  const { data } = await api.get<ApiCategory[]>('/categories')
  return data
}

export async function createCategory(name: string): Promise<ApiCategory> {
  try {
    const { data } = await api.post<ApiCategory>('/categories', { name })
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo crear la categoría'))
  }
}
