import { useState, useEffect, useCallback } from 'react'
import historyService from '../services/historyService'

export function useHistory() {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await historyService.getAll()
      setHistory(data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch history')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await historyService.getAll()
        if (mounted) setHistory(data || [])
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to fetch history')
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const deleteItem = useCallback(async (id) => {
    try {
      await historyService.remove(id)
      setHistory((prev) => prev.filter((item) => item._id !== id))
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  return { history, isLoading, error, refetch: fetchHistory, deleteItem }
}

export default useHistory
