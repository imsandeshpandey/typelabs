import { cn } from '@/lib/utils'
import { themes } from '../../config/themes.config'
import {
  useColorStyle,
  useCurrentThemeConfig,
  useTrueTheme,
} from '@/state/atoms'
import { CSSProperties } from 'react'
import {
  RadioCard,
  RadioCardContent,
  RadioCardDescription,
} from '../ui/radio-card'

export const ThemeSwitcher = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setColorStyle] = useColorStyle()
  const [currentThemeConfig, setCurrentThemeConfig] = useCurrentThemeConfig()
  const colors = themes

  const [theme] = useTrueTheme()

  return (
    <div className="grid grid-cols-6 gap-4 w-full flex-wrap">
      {colors.map((color) => {
        const primary = color.activeColor[theme]
        const isActive = color.name === currentThemeConfig.name

        const radius: string = color.cssVars.light?.radius || '0.5rem'
        const radiusStyle = +radius.split('rem')[0] / 2
        return (
          <RadioCard
            className=" flex-grow col-span-6 sm:col-span-3 md:col-span-2"
            key={color.name}
            isActive={isActive}
            onClick={() => {
              setCurrentThemeConfig(color)
              setColorStyle(color.name)
            }}
          >
            <RadioCardDescription
              className={cn('mb-1 font-medium', isActive && 'text-foreground')}
            >
              {color.label}
            </RadioCardDescription>
            <RadioCardContent className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <div
                  style={
                    {
                      '--theme-color': `hsl(${primary})`,
                      '--theme-radius': `${radiusStyle}rem`,
                    } as CSSProperties
                  }
                  className={cn(
                    'transition-all h-4 w-12 bg-[--theme-color] rounded-[--theme-radius]'
                  )}
                />
              </div>
              <p className="text-xs">Radius: {radius}</p>
            </RadioCardContent>
          </RadioCard>
        )
      })}
    </div>
  )
}
