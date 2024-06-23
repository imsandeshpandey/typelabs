import { useBorderRadius, useFont, useStyle, useUserFonts } from '@/atoms/atoms'
import { DEFAULT_FONT, FONTS } from '@/config/fonts.config'
import { generateFontCss } from '@/lib/utils'
import { useEffect, useRef } from 'react'

export const StyleProvider = () => {
  const root = document.documentElement
  const [currentFont, setCurrentFont] = useFont()
  const [userFonts] = useUserFonts()
  const [style] = useStyle()
  const [radius] = useBorderRadius()
  const lastTheme = useRef(
    [...root.classList].find((c) => c.startsWith('theme_')) || 'theme_'
  )

  useEffect(() => {
    const fontCollection = [...userFonts, ...FONTS]
    if (!fontCollection.some((font) => font === currentFont)) {
      setCurrentFont(DEFAULT_FONT)
    }
  }, [userFonts, currentFont])

  useEffect(() => {
    root.attributeStyleMap.set('--radius', `${radius}px`)
  }, [radius])

  useEffect(() => {
    root.style.fontFamily = generateFontCss(currentFont)
  }, [currentFont])

  useEffect(() => {
    root.classList.remove(lastTheme.current)
    root.classList.add(`theme_${style}`)
    lastTheme.current = `theme_${style}`
  }, [style])

  return <></>
}
