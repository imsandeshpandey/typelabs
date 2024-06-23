import { FONTS } from '@/config/fonts.config'
import { Dispatch, HTMLAttributes, SetStateAction, useState } from 'react'
import { useFont, useFontSize, useUserFonts } from '@/atoms/atoms'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  RadioCard,
  RadioCardContent,
  RadioCardDescription,
} from '@/components/ui/radio-card'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { AddFontModal } from './add-font-modal'
import { Dialog } from '@/components/ui/dialog'
import { generateFontCss } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'
import { FontSizeIcon } from '@radix-ui/react-icons'
import { ResetButton } from '@/components/compound-ui/reset-button'

export const FontSelect = () => {
  const [userFonts] = useUserFonts()
  const [, setFont] = useFont()
  const [value, setValue] = useState(
    'The Quick Brown fox jumps over the lazy dog.'
  )
  const [fontSize, setFontSize] = useFontSize()
  const fontSizeSliderValue = (fontSize / 24) * 100 - 50
  const handleFontSizeChange = (value: [number]) => {
    const updatedPercentage = value[0] + 50
    const updatedFontSize = (24 * updatedPercentage) / 100
    setFontSize(updatedFontSize)
  }
  return (
    <Dialog>
      <div>
        <h1 className="flex items-center text-xl font-bold">
          Text Size
          <ResetButton onClick={() => setFontSize(24)} />
        </h1>
        <p className="mb-4 text-sm text-muted-foreground">
          The text size is the size of the text in the game. The default size is
          <b> 24px.</b>
        </p>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <FontSizeIcon className="text-muted-foreground" />
            <p className="min-w-[1.5rem] font-bold">{fontSize >> 0}</p>
          </div>
          <Slider
            step={10}
            value={[fontSizeSliderValue]}
            onValueChange={handleFontSizeChange}
          />
        </div>
      </div>
      <div className="h-8" />
      <div>
        <h1 className="mb-2 text-xl font-bold">
          Fonts
          <ResetButton
            onClick={() => {
              setFont(FONTS[2])
            }}
          />
        </h1>
        <Label className="pl-1">Preview Text</Label>
        <Input
          className="resize-none border border-border bg-muted"
          placeholder="Type here to preview"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <h2 className="mb-2 mt-8 text-lg font-medium">Preinstalled Fonts</h2>
        <div className="grid max-h-full grid-cols-2 gap-4">
          {FONTS.map((font, i) => (
            <FontItem
              key={i}
              font={font}
              inputValue={value}
              setValue={setValue}
            />
          ))}
        </div>
        <div className="mb-2 mt-8 flex items-center justify-between">
          <h2 className="text-lg font-medium">My Fonts</h2>
          <AddFontModal.Trigger>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs hover:bg-foreground/5"
            >
              <PlusIcon className="h-4 w-4" /> Add/Manage Fonts
            </Button>
          </AddFontModal.Trigger>
        </div>
        {!userFonts.length && (
          <div className="flex flex-col items-center justify-center gap-4">
            <h2 className="text-xl font-bold">Your fonts will appear here</h2>
            <AddFontModal.Trigger>
              <Button
                variant="default"
                size="lg"
                className="text-md gap-2 px-5"
              >
                <PlusIcon className="h-6 w-6" /> Add New Font
              </Button>
            </AddFontModal.Trigger>
          </div>
        )}
        <div className="grid max-h-full grid-cols-2 gap-4">
          {!!userFonts.length && (
            <>
              {userFonts.map((font, i) => (
                <FontItem
                  key={i}
                  font={font as (typeof FONTS)[number]}
                  inputValue={value}
                  setValue={setValue}
                />
              ))}
            </>
          )}
        </div>
      </div>
      <AddFontModal.Content />
    </Dialog>
  )
}

const FontItem = ({
  font,
  inputValue,
}: {
  font: (typeof FONTS)[number]
  inputValue: string
  setValue: Dispatch<SetStateAction<string>>
  titleProps?: HTMLAttributes<HTMLElement>
}) => {
  const [currentFont, setCurrentFont] = useFont()
  return (
    <RadioCard
      className="col-span-2 min-w-[12rem] overflow-x-hidden md:col-span-1"
      onClick={() => setCurrentFont(font)}
      isActive={currentFont === font}
    >
      <RadioCardDescription
        style={{
          fontFamily: generateFontCss(font),
        }}
      >
        {font}
      </RadioCardDescription>
      <RadioCardContent>
        <p className="text-xl" style={{ fontFamily: generateFontCss(font) }}>
          {inputValue}
        </p>
      </RadioCardContent>
    </RadioCard>
  )
}
