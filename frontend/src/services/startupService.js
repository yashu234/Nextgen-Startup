import apiClient from '../config/api'
import { API_ENDPOINTS } from '../constants'

function isNetworkError(error) {
  return !error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || error.code === 'ECONNABORTED')
}

function unavailableError() {
  return new Error('Startup generation service unavailable. Please try again later.')
}

const startupService = {
  async generate(formData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.GENERATE, formData)
      return response.data
    } catch (error) {
      if (isNetworkError(error)) {
        throw unavailableError()
      }
      throw error
    }
  },
}

export default startupService
