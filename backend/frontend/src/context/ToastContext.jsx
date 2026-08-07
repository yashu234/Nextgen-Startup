/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useCallback, useRef, useState, useEffect } from 'react'
import { TOAST_TYPES } from '../constants'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  // Keep a ref so removeToast always has the current list
  const toastsRef = useRef(toasts)
  useEffect(() => {
    toastsRef.current = toasts
  }, [toasts])

  const addToast = useCallback(({ message, type = TOAST_TYPES.INFO, duration = 4000 }) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = {
    success: (message, duration) => addToast({ message, type: TOAST_TYPES.SUCCESS, duration }),
    error: (message, duration) => addToast({ message, type: TOAST_TYPES.ERROR, duration: duration ?? 6000 }),
    warning: (message, duration) => addToast({ message, type: TOAST_TYPES.WARNING, duration }),
    info: (message, duration) => addToast({ message, type: TOAST_TYPES.INFO, duration }),
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export default ToastContext
