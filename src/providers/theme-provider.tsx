import { COLOR_MODE_KEY } from '@/config/local-storage-keys'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { useSystemTheme } from '@/hooks/use-theme'
import { useColorStyle } from '@/state/atoms'
import { createContext, useEffect, useRef } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  ...props
}: ThemeProviderProps) {
  const [colorStyle] = useColorStyle()
  const lastTheme = useRef(colorStyle)

  const [theme, setTheme] = useLocalStorage<Theme>(COLOR_MODE_KEY, defaultTheme)
  const systemTheme = useSystemTheme()

  const root = window.document.documentElement

  useEffect(() => {
    root.classList.remove(`theme-${lastTheme.current}`)
    root.classList.add(`theme-${colorStyle}`)
    lastTheme.current = colorStyle

    root.classList.remove('light', 'dark')

    if (theme === 'system') return root.classList.add(systemTheme)

    root.classList.add(theme)
  }, [theme, colorStyle, systemTheme, root])

  useEffect(() => {
    if (theme !== 'system') return

    root.classList.remove('light', 'dark')
    root.classList.add(systemTheme)
  }, [systemTheme, root])

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeProviderContext.Provider>
  )
}
