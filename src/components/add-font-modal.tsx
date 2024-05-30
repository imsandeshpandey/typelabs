import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FONTS } from '@/config/fonts'
import { ReactNode, useCallback, useRef } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useFont, useUserFonts } from '@/state/atoms'
import { useToast } from './ui/use-toast'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Cross2Icon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { useSoundFx } from '@/hooks/use-sound-fx'

const trim = (s: string) => s.trim()

const Content = () => {
  const { toast, dismiss } = useToast()
  const [userFonts, setUserFonts] = useUserFonts()
  const playAudio = useSoundFx()
  const inputRef = useRef<HTMLInputElement>(null)

  function removeFonts(fonts: string[]) {
    playAudio('delete')
    const newUserFonts = new Set(userFonts)
    for (const font of fonts) {
      newUserFonts.delete(font)
    }
    setUserFonts([...newUserFonts])
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const userFontsCopy = [...userFonts]
    const inputValue = inputRef.current?.value || ''
    if (!inputValue) return

    const trueFontInput: string[] = []
    const fonts = inputValue
      .split(',')
      .map(trim)
      .filter(Boolean)
      .map((s) => {
        trueFontInput.push(s)
        const fontAlreadyAdded = [...FONTS, ...userFontsCopy].some(
          (i) => i.toLowerCase() === s.toLowerCase()
        )

        if (!fontAlreadyAdded) {
          userFontsCopy.push(s)
          return s
        }
      })
      .filter(Boolean) as string[]

    setUserFonts(userFontsCopy)

    if (inputRef.current) {
      inputRef.current.value = ''
    }

    if (!fonts.length) {
      toast({
        title: 'Failed to add Fonts',
        description: ' Fonts already exist or the input was invalid.',
      })
      playAudio('error')
      return
    }

    let toastTitle
    if (fonts.length != trueFontInput.length) {
      toastTitle = 'Some Fonts added'
    } else {
      toastTitle = `${fonts.length > 1 ? 'Fonts' : 'Font'} Added`
    }
    const toastDescription =
      fonts.length === 1
        ? `${fonts[0]} was added.`
        : `${fonts.map(trim).join(', ')} were added.`

    playAudio('neutral')
    toast({
      title: toastTitle,
      description: toastDescription,
      action: (
        <Button
          onClick={() => {
            removeFonts(fonts)
            dismiss()
          }}
        >
          Undo
        </Button>
      ),
    })
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <MyFonts />
      <DialogHeader>
        <DialogTitle>Add new Font</DialogTitle>
        <DialogDescription>
          Type the name of the font and make sure you have that font installed
          on your computer.
          <br />
          <br />
          You can add multiple fonts at once by comma separating them.
        </DialogDescription>
      </DialogHeader>
      <form action="submit" id="font-form" onSubmit={handleSubmit}>
        <Input
          className="z-10"
          ref={inputRef}
          form="font-form"
          id="font-input"
          placeholder="Roboto Mono, Poppins"
        />
        <Button type="submit" className="float-right mt-6">
          Add Fonts
        </Button>
      </form>
    </DialogContent>
  )
}

const Trigger = ({ children }: { children: ReactNode }) => (
  <DialogTrigger asChild>{children}</DialogTrigger>
)

const MyFonts = () => {
  const { toast, dismiss } = useToast()
  const [userFonts, setUserFonts] = useUserFonts()
  const [currentFont, setCurrentFont] = useFont()
  const playAudio = useSoundFx()

  const handleRemoveFont = useCallback(
    (font: string) => {
      playAudio('delete')

      const newUserFonts = new Set(userFonts)
      newUserFonts.delete(font)
      setUserFonts([...newUserFonts])

      toast({
        title: 'Font removed',
        description: `${font} was removed`,
        action: (
          <Button
            onClick={() => {
              playAudio('click')
              setUserFonts(userFonts)
              setCurrentFont(currentFont)
              dismiss()
            }}
          >
            Undo
          </Button>
        ),
      })
    },
    [userFonts, currentFont]
  )

  if (!userFonts.length) return <></>

  return (
    <>
      <DialogHeader>
        <DialogTitle>My Fonts</DialogTitle>
        <DialogDescription className="gap-2 flex flex-wrap pt-2 pb-4">
          {userFonts.map((font, i) => (
            <Button
              key={i}
              variant="secondary"
              style={{
                fontFamily: font,
              }}
              onClick={() => setCurrentFont(font)}
              className={cn(
                'flex h-fit gap-4 hover:bg-primary hover:text-primary-foreground items-center justify-between py-1 px-2 border border-border rounded-md w-fit',
                font == currentFont && 'bg-primary text-primary-foreground'
              )}
            >
              {font}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFont(font)
                    }}
                    className="text-xs hover:bg-background/40 p-[2px] w-5 h-5 rounded-full"
                    size="icon"
                    variant="ghost"
                  >
                    <Cross2Icon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove Font</TooltipContent>
              </Tooltip>
            </Button>
          ))}
        </DialogDescription>
      </DialogHeader>
    </>
  )
}

export const AddFontModal = { Content, Trigger }
