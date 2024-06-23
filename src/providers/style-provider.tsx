import { useBorderRadius, useFont, useStyle, useUserFonts } from '@/atoms/atoms'
import { DEFAULT_FONT, FONTS } from '@/config/fonts.config'
import { generateFontCss } from '@/lib/utils'
import { useEffect } from 'react'

export const StyleProvider = () => {
  const [currentFont, setCurrentFont] = useFont()
  const [userFonts] = useUserFonts()
  const [style] = useStyle()
  const [radius] = useBorderRadius()
  const root = document.documentElement

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

  const stylePath = `${window.origin}/src/assets/themes/${style}.css`
  return <link rel="stylesheet" type="text/css" href={stylePath} />
}
