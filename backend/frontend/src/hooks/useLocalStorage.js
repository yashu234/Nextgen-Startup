import { useState, useCallback } from 'react'

/**
 * Syncs state to localStorage with JSON serialization.
 * Falls back to initialValue if the key is missing or corrupted.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        if (valueToStore === undefined || valueToStore === null) {
          localStorage.removeItem(key)
        } else {
          localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.error(`useLocalStorage: failed to set "${key}"`, error)
      }
    },
    [key, storedValue]
  )

  const removeValue = useCallback(() => {
    localStorage.removeItem(key)
    setStoredValue(initialValue)
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

export default useLocalStorage
