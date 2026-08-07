/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useCallback } from 'react'
import { STORAGE_KEYS } from '../constants'
import startupService from '../services/startupService'

const StartupContext = createContext(null)

function tryParseResult() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_RESULT)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const initialState = {
  formData: {
    idea: '',
    industry: '',
    budget: '',
    businessType: '',
    targetAudience: '',
    location: '',
  },
  result: tryParseResult(),
  isGenerating: false,
  error: null,
}

function startupReducer(state, action) {
  switch (action.type) {
    case 'SET_FORM_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } }

    case 'GENERATE_START':
      return { ...state, isGenerating: true, error: null }

    case 'GENERATE_SUCCESS':
      return {
        ...state,
        result: action.payload,
        isGenerating: false,
        error: null,
      }

    case 'GENERATE_FAILURE':
      return { ...state, isGenerating: false, error: action.payload }

    case 'SET_RESULT':
      return { ...state, result: action.payload }

    case 'RESET_RESULT':
      return { ...state, result: null, error: null }

    case 'RESET_FORM':
      return { ...state, formData: initialState.formData }

    default:
      return state
  }
}

export function StartupProvider({ children }) {
  const [state, dispatch] = useReducer(startupReducer, initialState)

  const setFormData = useCallback((data) => {
    dispatch({ type: 'SET_FORM_DATA', payload: data })
  }, [])

  const generateKit = useCallback(async () => {
    dispatch({ type: 'GENERATE_START' })
    try {
      const result = await startupService.generate(state.formData)
      localStorage.setItem(STORAGE_KEYS.LAST_RESULT, JSON.stringify(result))
      dispatch({ type: 'GENERATE_SUCCESS', payload: result })
      return { success: true, data: result }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to generate startup kit. Please try again.'
      dispatch({ type: 'GENERATE_FAILURE', payload: message })
      return { success: false, error: message }
    }
  }, [state.formData])

  const setResult = useCallback((result) => {
    localStorage.setItem(STORAGE_KEYS.LAST_RESULT, JSON.stringify(result))
    dispatch({ type: 'SET_RESULT', payload: result })
  }, [])

  const resetResult = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.LAST_RESULT)
    dispatch({ type: 'RESET_RESULT' })
  }, [])

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' })
  }, [])

  const value = {
    formData: state.formData,
    result: state.result,
    isGenerating: state.isGenerating,
    error: state.error,
    hasResult: !!state.result,
    setFormData,
    generateKit,
    setResult,
    resetResult,
    resetForm,
  }

  return (
    <StartupContext.Provider value={value}>{children}</StartupContext.Provider>
  )
}

export function useStartup() {
  const context = useContext(StartupContext)
  if (!context) {
    throw new Error('useStartup must be used within StartupProvider')
  }
  return context
}

export default StartupContext
