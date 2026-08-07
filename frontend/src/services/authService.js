import apiClient from '../config/api'
import { API_ENDPOINTS } from '../constants'

// Helper to check if an error is a network connection failure (backend offline)
function isNetworkError(error) {
  return !error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || error.code === 'ECONNABORTED')
}

function unavailableError() {
  return new Error('Authentication service unavailable. Please try again later.')
}

function unwrapResponse(response) {
  return response.data?.data ?? response.data
}

const authService = {
  async login(email, password) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, { email, password })
      return unwrapResponse(response)
    } catch (error) {
      if (isNetworkError(error)) {
        throw unavailableError()
      }
      throw error
    }
  },

  async signup(name, email, password) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SIGNUP, { name, email, password })
      return unwrapResponse(response)
    } catch (error) {
      if (isNetworkError(error)) {
        throw unavailableError()
      }
      throw error
    }
  },

  async getProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ME)
      return response.data
    } catch (error) {
      if (isNetworkError(error)) {
        throw unavailableError()
      }
      throw error
    }
  },

  async updateProfile(data) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.ME, data)
      return response.data
    } catch (error) {
      if (isNetworkError(error)) {
        throw unavailableError()
      }
      throw error
    }
  },

  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      })
      return response.data
    } catch (error) {
      if (isNetworkError(error)) {
        throw unavailableError()
      }
      throw error
    }
  },
}

export default authService
