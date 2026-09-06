import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { refreshSession } from '../services/auth-service'

export function useAuthBootstrap() {
  const setInitializing = useAuthStore((state) => state.setInitializing)
  const hasStarted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    refreshSession().finally(() => setInitializing(false))
  }, [setInitializing])
}
