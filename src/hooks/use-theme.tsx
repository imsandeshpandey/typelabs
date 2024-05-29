import { useContext, useEffect, useState } from 'react'
import { ThemeProviderContext } from '../providers/theme-provider'

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

export const useSystemTheme = () => {
  const sysMedia = window.matchMedia('(prefers-color-scheme: dark)')

  const [theme, setTheme] = useState(getSystemTheme())

  useEffect(() => {
    const onChange = () => setTheme(getSystemTheme)

    sysMedia.addEventListener('change', onChange)

    return () => removeEventListener('change', onChange)
  }, [sysMedia])

  return theme as 'dark' | 'light'
}
