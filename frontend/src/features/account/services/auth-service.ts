import { AxiosError } from 'axios'
import { api, setAccessToken } from '@/lib/api'
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

function extractErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message
    if (Array.isArray(message)) return message.join(', ')
    if (typeof message === 'string') return message
  }
  return fallback
}

export async function login(values: LoginFormValues): Promise<AuthSession> {
  try {
    const { data } = await api.post<AuthSession>('/auth/login', values)
    setAccessToken(data.accessToken)
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo iniciar sesión'))
  }
}

export async function signUp(values: SignUpPayload): Promise<AuthSession> {
  try {
    const { data } = await api.post<AuthSession>('/auth/signup', values)
    setAccessToken(data.accessToken)
    return data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'No se pudo crear la cuenta'))
  }
}
