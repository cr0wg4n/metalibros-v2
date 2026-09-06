import { api, setAccessToken } from '@/lib/api'
import { useAuthStore } from '@/store/auth-store'
import { extractErrorMessage } from '@/lib/extract-error-message'
import type { LoginFormValues } from '../schemas/login-schema'

export interface AuthUser {
  id: string
  email: string
  name: string
}

export interface AuthSession {
  accessToken: string
  user: AuthUser
}

export interface SignUpPayload {
  name: string
  email: string
  password: string
}

function applySession(session: AuthSession) {
  setAccessToken(session.accessToken)
  useAuthStore.getState().setUser(session.user)
}

function clearSession() {
  setAccessToken(null)
  useAuthStore.getState().clear()
}

export async function login(values: LoginFormValues): Promise<AuthSession> {
  try {
    const { data } = await api.post<AuthSession>('/auth/login', values)
    applySession(data)
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo iniciar sesión'))
  }
}

export async function signUp(values: SignUpPayload): Promise<AuthSession> {
  try {
    const { data } = await api.post<AuthSession>('/auth/signup', values)
    applySession(data)
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo crear la cuenta'))
  }
}

export async function refreshSession(): Promise<AuthSession | null> {
  try {
    const { data } = await api.post<AuthSession>('/auth/refresh')
    applySession(data)
    return data
  } catch {
    clearSession()
    return null
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout')
  } finally {
    clearSession()
  }
}
