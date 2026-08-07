import { useEffect } from 'react'
import useLocalStorage from './useLocalStorage'

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('sf_theme', 'system')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) root.classList.add('dark')
      else root.classList.remove('dark')
    }
  }, [theme])

  return { theme, setTheme }
}

export default useTheme
