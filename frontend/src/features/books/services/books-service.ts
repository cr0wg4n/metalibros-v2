import { api } from '@/lib/api'
import { env } from '@/config/env'
import { extractErrorMessage } from '@/lib/extract-error-message'

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

export interface CreateBookPayload {
  name: string
  author: string
  description: string
  sellingPrice: number
  costPrice: number
  releaseDate: string
  categoryIds: string[]
}

export async function createBook(payload: CreateBookPayload): Promise<ApiBook> {
  try {
    const { data } = await api.post<ApiBook>('/books', payload)
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo registrar el libro'))
  }
}

export async function uploadBookCover(bookId: string, file: File): Promise<ApiBook> {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const { data } = await api.post<ApiBook>(`/books/${bookId}/cover`, formData)
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'El libro se registró, pero no se pudo subir la portada'))
  }
}

export async function updateBookStatus(bookId: string, status: ApiBookStatus): Promise<ApiBook> {
  try {
    const { data } = await api.patch<ApiBook>(`/books/${bookId}/status`, { status })
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo actualizar el estado del libro'))
  }
}

export function resolveCoverUrl(coverImage: string | null): string | undefined {
  return coverImage ? `${env.apiUrl}${coverImage}` : undefined
}
