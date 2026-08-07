import axios from 'axios'
import { STORAGE_KEYS } from '../constants'

const BASE_URL = (() => {
  const apiUrl = import.meta.env.VITE_API_URL
  if (apiUrl) return apiUrl
  if (import.meta.env.DEV) return 'http://localhost:5000/api'
  throw new Error('Missing VITE_API_URL. Set the production API base URL before deploying Startup Forge.')
})()

function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEYS.USER)
  sessionStorage.removeItem(STORAGE_KEYS.USER)
}

// Single centralized Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true, // Crucial for sending/receiving HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Response interceptor: Handle status codes and Refresh Token rotation
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject })
        }).then(() => {
          return apiClient(originalRequest)
        }).catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Attempt to hit the refresh endpoint
        await axios.get(`${BASE_URL}/auth/refresh`, { withCredentials: true })
        isRefreshing = false
        processQueue(null)
        // Retry original request automatically
        return apiClient(originalRequest)
      } catch (err) {
        isRefreshing = false
        processQueue(err, null)
        // Refresh failed, meaning session is truly dead
        clearStoredAuth()
        try {
          window.dispatchEvent(new Event('sf_logout'))
        } catch {}
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(err)
      }
    } else if (import.meta.env.DEV) {
      console.error(`[API Error ${status || 'Network'}]`, error.response?.data || error.message)
    }

    return Promise.reject(error)
  }
)

export default apiClient
export { BASE_URL }
