import { create } from 'zustand'
import type { AuthUser } from '@/features/account/services/auth-service'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isInitializing: boolean
  setUser: (user: AuthUser | null) => void
  clear: () => void
  setInitializing: (value: boolean) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  setUser: (user) => set({ user, isAuthenticated: user !== null }),
  clear: () => set({ user: null, isAuthenticated: false }),
  setInitializing: (value) => set({ isInitializing: value }),
}))
