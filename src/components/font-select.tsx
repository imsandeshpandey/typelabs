import { Dialog } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { DEFAULT_FONT, FONTS } from '@/config/fonts'
import { useEffect } from 'react'
import { Button } from './ui/button'
import { useFont, useUserFonts } from '@/state/atoms'
import { AddFontModal } from './add-font-modal'
import { FontFamilyIcon } from '@radix-ui/react-icons'

export const FontSelect = () => {
  const root = document.documentElement

  const [currentFont, setCurrentFont] = useFont()
  const [userFonts] = useUserFonts()

  useEffect(() => {
    const fontCollection = [...userFonts, ...FONTS]
    if (!fontCollection.some((font) => font === currentFont)) {
      setCurrentFont(DEFAULT_FONT)
    }
  }, [userFonts, currentFont])

  useEffect(() => {
    root.style.removeProperty('font-family')
    root.style.fontFamily = currentFont
  }, [currentFont])

  const handleChange = (value: string) => {
    if (value === 'custom') return

    const fontsCollection = [...userFonts, ...FONTS]
    const font = fontsCollection.find((font) => font == value)!

    setCurrentFont(font)
  }

  return (
    <Dialog>
      <Select value={currentFont} onValueChange={handleChange}>
        <div>
          <p className="text-xs flex gap-1 items-center text-muted-foreground px-3">
            <FontFamilyIcon className="border border-muted-foreground/50 rounded-sm" />
            Font
          </p>
          <SelectTrigger className="w-[180px] bg-muted">
            <SelectValue placeholder="Select Font" />
          </SelectTrigger>
        </div>
        <SelectContent>
          <SelectGroup>
            {FONTS.map((font, i) => (
              <SelectItem
                style={{
                  fontFamily: font,
                }}
                className={`font-${font}`}
                key={i}
                value={font}
              >
                {font}
              </SelectItem>
            ))}
          </SelectGroup>
          {!!userFonts.length && (
            <>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>User Fonts</SelectLabel>
                {userFonts.map((font, i) => (
                  <SelectItem
                    style={{
                      fontFamily: font,
                    }}
                    key={i}
                    value={font}
                  >
                    {font}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectSeparator />
            </>
          )}
          <AddFontModal.Trigger>
            <Button
              variant="ghost"
              className="h-8 w-full font-normal justify-start px-8"
              value="custom"
            >
              Custom...
            </Button>
          </AddFontModal.Trigger>
        </SelectContent>
      </Select>
      <AddFontModal.Content />
    </Dialog>
  )
}
