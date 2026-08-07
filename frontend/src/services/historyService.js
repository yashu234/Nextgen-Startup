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
    try {
      const response = await apiClient.get(API_ENDPOINTS.HISTORY)
      return response.data?.data ?? response.data
    } catch (error) {
      if (isNetworkError(error)) {
        throw unavailableError()
      }
      throw error
    }
  },

  async getById(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.HISTORY_ITEM(id))
      return response.data
    } catch (error) {
      if (isNetworkError(error)) {
        throw unavailableError()
      }
      throw error
    }
  },

  async remove(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.HISTORY_ITEM(id))
      return response.data
    } catch (error) {
      if (isNetworkError(error)) {
        throw unavailableError()
      }
      throw error
    }
  },
}

export default historyService
