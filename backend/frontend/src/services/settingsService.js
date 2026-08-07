import apiClient from '../config/api'

function isNetworkError(error) {
  return !error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || error.code === 'ECONNABORTED')
}

const settingsService = {
  async getSettings() {
    try {
      const response = await apiClient.get('/settings')
      return response.data
    } catch (error) {
      if (isNetworkError(error)) {
        return { appearance: 'system', notifications: { email: true, projectUpdates: true } }
      }
      throw error
    }
  },

  async updateSettings(settings) {
    try {
      const response = await apiClient.put('/settings', settings)
      return response.data
    } catch (error) {
      if (isNetworkError(error)) {
        return { ...settings }
      }
      throw error
    }
  },
}

export default settingsService
