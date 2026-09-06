import { useEffect, useMemo, useState } from 'react'
import { debounce } from 'es-toolkit'

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  const debouncedSet = useMemo(() => debounce(setDebouncedValue, delayMs), [delayMs])

  useEffect(() => {
    debouncedSet(value)
    return () => debouncedSet.cancel()
  }, [value, debouncedSet])

  return debouncedValue
}
