import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { hasSessionHint, refreshSession } from '../services/auth-service'

export function useAuthBootstrap() {
  const setInitializing = useAuthStore((state) => state.setInitializing)
  const hasStarted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    if (!hasSessionHint()) {
      setInitializing(false)
      return
    }

    refreshSession().finally(() => setInitializing(false))
  }, [setInitializing])
}
