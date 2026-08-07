import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * Manages async operation state: loading, data, error.
 * execute() is stable across renders (useRef pattern).
 */
export function useAsync(asyncFn) {
  const [state, setState] = useState({
    isLoading: false,
    data: null,
    error: null,
  })

  // Use ref so the returned execute fn never changes identity
  const asyncFnRef = useRef(asyncFn)
  useEffect(() => {
    asyncFnRef.current = asyncFn
  }, [asyncFn])

  const execute = useCallback(async (...args) => {
    setState({ isLoading: true, data: null, error: null })
    try {
      const data = await asyncFnRef.current(...args)
      setState({ isLoading: false, data, error: null })
      return { success: true, data }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred'
      setState({ isLoading: false, data: null, error: message })
      return { success: false, error: message }
    }
  }, [])

  const reset = useCallback(() => {
    setState({ isLoading: false, data: null, error: null })
  }, [])

  return { ...state, execute, reset }
}

export default useAsync
