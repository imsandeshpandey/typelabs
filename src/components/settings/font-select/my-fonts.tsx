import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCallback } from 'react'
import { Button } from '../../ui/button'
import { useFont, useUserFonts } from '@/state/atoms'
import { useToast } from '../../ui/use-toast'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip'
import { Cross2Icon } from '@radix-ui/react-icons'
import { cn, generateFontCss } from '@/lib/utils'
import { useSoundFx } from '@/hooks/use-sound-fx.hook'

export const MyFonts = () => {
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
                fontFamily: generateFontCss(font),
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
