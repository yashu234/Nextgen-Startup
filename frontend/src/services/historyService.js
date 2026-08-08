import apiClient from '../config/api'
import { API_ENDPOINTS } from '../constants'

function isNetworkError(error) {
  return !error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || error.code === 'ECONNABORTED')
}

function unavailableError() {
  return new Error('History service unavailable. Please try again later.')
}

const historyService = {
  async getAll() {
    const localItems = (() => {
      try { return JSON.parse(localStorage.getItem('sf_local_history') || '[]') } catch { return [] }
    })()

    try {
      const response = await apiClient.get(API_ENDPOINTS.HISTORY)
      const payload = response.data?.data ?? response.data
      const remoteItems = Array.isArray(payload) ? payload : (payload?.projects || [])
      
      const merged = [...remoteItems]
      localItems.forEach((local) => {
        if (!merged.some((r) => r._id === local._id)) {
          merged.push(local)
        }
      })
      return merged
    } catch (error) {
      if (localItems.length > 0) {
        return localItems
      }
      if (isNetworkError(error)) {
        throw unavailableError()
      }
      return []
    }
  },

  async getById(id) {
    if (id && String(id).startsWith('local_')) {
      const localItems = JSON.parse(localStorage.getItem('sf_local_history') || '[]')
      const found = localItems.find((item) => item._id === id)
      if (found) {
        return found.generatedResult || found
      }
    }
    try {
      const response = await apiClient.get(API_ENDPOINTS.HISTORY_ITEM(id))
      return response.data?.data ?? response.data
    } catch (error) {
      const localItems = JSON.parse(localStorage.getItem('sf_local_history') || '[]')
      const found = localItems.find((item) => item._id === id)
      if (found) {
        return found.generatedResult || found
      }
      if (isNetworkError(error)) {
        throw unavailableError()
      }
      throw error
    }
  },

  async remove(id) {
    try {
      if (!String(id).startsWith('local_')) {
        await apiClient.delete(API_ENDPOINTS.HISTORY_ITEM(id))
      }
    } catch (error) {
      console.warn('Backend delete failed, removing locally:', error.message)
    } finally {
      const localItems = JSON.parse(localStorage.getItem('sf_local_history') || '[]')
      const updated = localItems.filter((i) => i._id !== id)
      localStorage.setItem('sf_local_history', JSON.stringify(updated))
    }
    return { success: true }
  },
}

export default historyService
