import { FONTS } from '@/config/fonts.config'
import { Dispatch, HTMLAttributes, SetStateAction, useState } from 'react'
import { useFont, useUserFonts } from '@/state/atoms'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import {
  RadioCard,
  RadioCardContent,
  RadioCardDescription,
} from '../../ui/radio-card'
import { Button } from '../../ui/button'
import { PlusIcon } from 'lucide-react'
import { AddFontModal } from './add-font-modal'
import { Dialog } from '../../ui/dialog'
import { generateFontCss } from '@/lib/utils'

export const FontSelect = () => {
  const [userFonts] = useUserFonts()

  const [value, setValue] = useState(
    'The Quick Brown fox jumps over the lazy dog.'
  )
  return (
    <Dialog>
      <div>
        <Label className="pl-1">Preview Text</Label>
        <Input
          className="resize-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <h2 className="text-xl mt-8 mb-2 font-bold">Preinstalled Fonts</h2>
        <div className="grid grid-cols-2 gap-4 max-h-full">
          {FONTS.map((font, i) => (
            <FontItem
              key={i}
              font={font}
              inputValue={value}
              setValue={setValue}
            />
          ))}
        </div>
        <div className="mt-8 mb-2 flex justify-between items-center">
          <h2 className="text-xl font-bold">My Fonts</h2>
          <AddFontModal.Trigger>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs hover:bg-foreground/5"
            >
              <PlusIcon className="w-4 h-4" /> Add/Manage Fonts
            </Button>
          </AddFontModal.Trigger>
        </div>
        {!userFonts.length && (
          <div className="flex flex-col gap-4 justify-center items-center">
            <h2 className="text-xl font-bold">Your fonts will appear here</h2>
            <AddFontModal.Trigger>
              <Button
                variant="default"
                size="lg"
                className="gap-2 px-5 text-md"
              >
                <PlusIcon className="h-6 w-6" /> Add New Font
              </Button>
            </AddFontModal.Trigger>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 max-h-full">
          {!!userFonts.length && (
            <>
              {userFonts.map((font, i) => (
                <FontItem
                  key={i}
                  font={font}
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
  font: string
  inputValue: string
  setValue: Dispatch<SetStateAction<string>>
  titleProps?: HTMLAttributes<HTMLElement>
}) => {
  const [currentFont, setCurrentFont] = useFont()
  return (
    <RadioCard
      className="overflow-x-hidden min-w-[12rem] col-span-2 md:col-span-1"
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
