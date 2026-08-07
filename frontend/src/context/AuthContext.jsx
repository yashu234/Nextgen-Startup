/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { STORAGE_KEYS } from '../constants'
import authService from '../services/authService'

const AuthContext = createContext(null)

const STORAGE_TYPE = {
  LOCAL: 'local',
  SESSION: 'session',
}

function readStoredAuth() {
  try {
    const localUser = localStorage.getItem(STORAGE_KEYS.USER)
    if (localUser) {
      return {
        user: JSON.parse(localUser),
        storageType: STORAGE_TYPE.LOCAL,
      }
    }

    const sessionUser = sessionStorage.getItem(STORAGE_KEYS.USER)
    if (sessionUser) {
      return {
        user: JSON.parse(sessionUser),
        storageType: STORAGE_TYPE.SESSION,
      }
    }
  } catch {
    /* ignore corrupted storage */
  }

  return { user: null, storageType: null }
}

function clearStoredAuth() {
  localStorage.removeItem(STORAGE_KEYS.USER)
  sessionStorage.removeItem(STORAGE_KEYS.USER)
}

function getAuthStorage(storageType) {
  return storageType === STORAGE_TYPE.SESSION ? sessionStorage : localStorage
}

const storedAuth = readStoredAuth()

const initialState = {
  user: storedAuth.user,
  storageType: storedAuth.storageType,
  isLoading: false,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true }

    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        storageType: action.payload.storageType,
        isLoading: false,
      }

    case 'AUTH_FAILURE':
      return { ...state, isLoading: false }

    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } }

    case 'LOGOUT':
      return { user: null, storageType: null, isLoading: false }

    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Keep context state in sync when logout happens outside React (e.g. API interceptor)
  useEffect(() => {
    const handleLogoutEvent = () => {
      authService.logout() // Tell backend to clear cookies
      dispatch({ type: 'LOGOUT' })
    }

    const handleStorage = (e) => {
      if (e.key === STORAGE_KEYS.USER && !e.newValue) {
        dispatch({ type: 'LOGOUT' })
      }
    }

    window.addEventListener('sf_logout', handleLogoutEvent)
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('sf_logout', handleLogoutEvent)
      window.removeEventListener('storage', handleStorage)
    }
  }, [dispatch])

  const login = useCallback((user, rememberMe = true) => {
    clearStoredAuth()
    const storageType = rememberMe ? STORAGE_TYPE.LOCAL : STORAGE_TYPE.SESSION
    const authStorage = getAuthStorage(storageType)
    authStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    dispatch({ type: 'AUTH_SUCCESS', payload: { user, storageType } })
  }, [])

  const logout = useCallback(async () => {
    clearStoredAuth()
    localStorage.removeItem(STORAGE_KEYS.LAST_RESULT)
    await authService.logout() // Hit backend to clear cookies
    dispatch({ type: 'LOGOUT' })
  }, [])

  const updateUser = useCallback((updatedFields) => {
    const updated = { ...state.user, ...updatedFields }
    const authStorage = getAuthStorage(state.storageType)
    authStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated))
    dispatch({ type: 'UPDATE_USER', payload: updatedFields })
  }, [state.user, state.storageType])

  const setLoading = useCallback((loading) => {
    dispatch({ type: loading ? 'AUTH_START' : 'AUTH_FAILURE' })
  }, [])

  const value = {
    user: state.user,
    isAuthenticated: !!state.user,
    isLoading: state.isLoading,
    storageType: state.storageType,
    login,
    logout,
    updateUser,
    setLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default AuthContext
