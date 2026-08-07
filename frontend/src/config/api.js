import axios from 'axios'
import { STORAGE_KEYS } from '../constants'

const BASE_URL = (() => {
  const apiUrl = import.meta.env.VITE_API_URL
  if (apiUrl) return apiUrl
  if (import.meta.env.DEV) return 'http://localhost:5000/api'
  throw new Error('Missing VITE_API_URL. Set the production API base URL before deploying Startup Forge.')
})()

function getStoredToken() {
  return localStorage.getItem(STORAGE_KEYS.TOKEN) || sessionStorage.getItem(STORAGE_KEYS.TOKEN)
}

function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEYS.TOKEN)
  localStorage.removeItem(STORAGE_KEYS.USER)
  sessionStorage.removeItem(STORAGE_KEYS.TOKEN)
  sessionStorage.removeItem(STORAGE_KEYS.USER)
}

// Single centralized Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor: Attach JWT token & standard headers automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('[API Request Error]', error)
    }
    return Promise.reject(error)
  }
)

// Response interceptor: Handle status codes (200, 201, 204, 400, 401, 403, 404, 429, 500)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      // Token expired or invalid — clear session and notify app to logout
      clearStoredAuth()
      try {
        // notify any listeners (AuthContext) about logout so in-memory state stays in sync
        window.dispatchEvent(new Event('sf_logout'))
      } catch {
        /* ignore */
      }
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    } else if (import.meta.env.DEV) {
      console.error(`[API Error ${status || 'Network'}]`, error.response?.data || error.message)
    }

    return Promise.reject(error)
  }
)

export default apiClient
export { BASE_URL }
