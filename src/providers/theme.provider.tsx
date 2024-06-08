import { DEFAULT_FONT, FONTS } from '@/config/fonts.config'
import { themes } from '@/config/themes.config'
import { useSystemTheme } from '@/hooks/use-theme.hook'
import { generateFontCss } from '@/lib/utils'
import {
  useColorStyle,
  useCurrentThemeConfig,
  useFont,
  useTheme,
  useTrueTheme,
  useUserFonts,
} from '@/state/atoms'
import React from 'react'
import { useEffect, useRef } from 'react'

export function ThemeProvider() {
  const root = document.documentElement
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setTrueTheme] = useTrueTheme()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [__, setCurrentThemeConfig] = useCurrentThemeConfig()
  const [colorStyle] = useColorStyle()
  const lastTheme = useRef(colorStyle)

  const [theme] = useTheme()
  const systemTheme = useSystemTheme()

  const [currentFont, setCurrentFont] = useFont()
  const [userFonts] = useUserFonts()

  useEffect(() => {
    const newCurrentThemeConfig = themes.find(
      (theme) => theme.name === colorStyle
    )
    setCurrentThemeConfig(newCurrentThemeConfig!)
  }, [colorStyle])

  useEffect(() => {
    const fontCollection = [...userFonts, ...FONTS]
    if (!fontCollection.some((font) => font === currentFont)) {
      setCurrentFont(DEFAULT_FONT)
    }
  }, [userFonts, currentFont])

  useEffect(() => {
    root.style.fontFamily = generateFontCss(currentFont)
  }, [currentFont])

  useEffect(() => {
    root.classList.remove(`theme-${lastTheme.current}`)
    root.classList.add(`theme-${colorStyle}`)
    lastTheme.current = colorStyle

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      setTrueTheme(systemTheme)
      return root.classList.add(systemTheme)
    }
    setTrueTheme(theme)
    root.classList.add(theme)
  }, [theme, colorStyle, systemTheme, root])

  return <></>
}
