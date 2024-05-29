import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { cn } from '@/lib/utils'
import { themes } from '../config/themes'
import { CheckIcon } from 'lucide-react'
import { useSystemTheme } from '@/hooks/use-theme'
import { useColorStyle } from '@/state/atoms'

export const ThemeSwitcher = () => {
  const [colorStyle, setColorStyle] = useColorStyle()

  const mode = useSystemTheme()
  const currentTheme = themes.find((theme) => theme.name === colorStyle)!

  const colors = ['zinc', 'rose', 'blue', 'green', 'orange']
  // const colors = themes;

  return (
    <div className="group flex items-center relative h-full transition-all pr-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn(
              'flex -right-8 absolute transition-all border-[--theme-primary] backdrop-blur-md z-10 h-9 w-9 bg-muted items-center justify-center rounded-full border-2 text-xs'
            )}
            style={
              {
                '--theme-primary': `hsl(${
                  currentTheme?.activeColor[mode === 'dark' ? 'dark' : 'light']
                })`,
              } as React.CSSProperties
            }
          >
            <span
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full bg-[--theme-primary]'
              )}
            >
              <CheckIcon className="h-4 w-4 text-white" />
            </span>
            <span className="sr-only">{currentTheme.label}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent
          className="rounded-[0.5rem] bg-zinc-900 text-zinc-50"
          align="center"
        >
          {currentTheme.label}
        </TooltipContent>
      </Tooltip>

      {colors.map((color, i) => {
        const theme = themes.find((theme) => theme.name === color)!
        return (
          <Tooltip key={theme.name}>
            <TooltipTrigger asChild>
              <button
                onClick={() => setColorStyle(theme.name)}
                className={cn(
                  'flex z-0 border-none hover:pb-2 -mr-5 group-hover:mr-1 transition-all h-8 w-8 bg-muted items-center justify-center rounded-full text-xs'
                )}
                style={
                  {
                    '--theme-primary': `hsl(${
                      theme?.activeColor[mode === 'dark' ? 'dark' : 'light']
                    })`,
                  } as React.CSSProperties
                }
              >
                <span
                  style={{
                    opacity: i / colors.length,
                  }}
                  className={cn(
                    'flex transition-all group-hover:opacity-[1!important] h-6 w-6 grou items-center justify-center rounded-full bg-[--theme-primary]'
                  )}
                ></span>
                <span className="sr-only">{theme.label}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent
              className="rounded-[0.5rem] bg-zinc-900 text-zinc-50"
              align="center"
            >
              {theme.label}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
