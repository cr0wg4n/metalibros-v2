import { api } from '@/lib/api'
import { env } from '@/config/env'
import { extractErrorMessage } from '@/lib/extract-error-message'
import { useAuthStore } from '@/store/auth-store'

export interface ApiProfile {
  id: string
  email: string
  name: string
  about: string | null
  avatar: string | null
  phone: string | null
}

export interface UpdateProfilePayload {
  name?: string
  email?: string
  about?: string
  phone?: string
}

function syncAuthUser(profile: ApiProfile) {
  useAuthStore.getState().setUser({ id: profile.id, email: profile.email, name: profile.name, avatar: profile.avatar })
}

export async function getProfile(): Promise<ApiProfile> {
  const { data } = await api.get<ApiProfile>('/auth/me')
  syncAuthUser(data)
  return data
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<ApiProfile> {
  try {
    const { data } = await api.patch<ApiProfile>('/auth/me', payload)
    syncAuthUser(data)
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo actualizar el perfil'))
  }
}

export async function uploadAvatar(file: File): Promise<ApiProfile> {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const { data } = await api.post<ApiProfile>('/auth/me/avatar', formData)
    syncAuthUser(data)
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo actualizar la foto de perfil'))
  }
}

export function resolveAvatarUrl(avatar: string | null): string | undefined {
  return avatar ? `${env.apiUrl}${avatar}` : undefined
}
