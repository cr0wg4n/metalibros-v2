import { api } from '@/lib/api'
import { env } from '@/config/env'

export interface ApiBookCategory {
  id: string
  name: string
}

export type ApiBookStatus = 'PUBLISHED' | 'UNPUBLISHED'

export interface ApiBook {
  id: string
  name: string
  author: string
  description: string
  sellingPrice: number
  costPrice: number
  releaseDate: string
  status: ApiBookStatus
  coverImage: string | null
  categories: ApiBookCategory[]
  createdAt: string
  updatedAt: string
}

export interface ListBooksParams {
  status?: ApiBookStatus
  categoryId?: string
  search?: string
  page?: number
  limit?: number
}

export interface ListBooksResponse {
  data: ApiBook[]
  meta: { page: number; limit: number; total: number }
}

export async function listBooks(params: ListBooksParams = {}): Promise<ListBooksResponse> {
  const { data } = await api.get<ListBooksResponse>('/books', { params })
  return data
}

export function resolveCoverUrl(coverImage: string | null): string | undefined {
  return coverImage ? `${env.apiUrl}${coverImage}` : undefined
}
