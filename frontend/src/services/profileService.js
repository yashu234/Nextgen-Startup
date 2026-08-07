import apiClient from '../config/api'
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants'

function isNetworkError(error) {
  return !error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || error.code === 'ECONNABORTED')
}

const profileService = {
  async getProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ME)
      return response.data
    } catch (error) {
      if (isNetworkError(error)) {
        const stored = localStorage.getItem(STORAGE_KEYS.USER)
        return stored ? JSON.parse(stored) : { _id: 'demo_user', name: 'Demo Founder', email: 'demo@startupforge.io' }
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
        return { ...data }
      }
      throw error
    }
  },
}

export default profileService
