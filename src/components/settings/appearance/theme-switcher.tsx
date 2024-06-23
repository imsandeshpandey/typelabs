import { cn, formatThemeName } from '@/lib/utils'
import colors from '@/assets/themes/theme-list.json'
import { useStyle } from '@/atoms/atoms'
import {
  RadioCard,
  RadioCardContent,
  RadioCardDescription,
} from '@/components/ui/radio-card'

export const ThemeSwitcher = () => {
  const [colorStyle, setColorStyle] = useStyle()

  return (
    <div className="grid w-full grid-cols-6 flex-wrap gap-4">
      {colors.map((color) => {
        const primary = color.mainColor
        const bg = color.bgColor
        const sub = color.subColor
        const text = color.textColor
        const displayColors = [primary, sub, text]
        const isActive = color.name === colorStyle

        return (
          <RadioCard
            className={cn(
              'col-span-6 flex-grow outline-transparent md:col-span-3',
              {
                'outline-primary': isActive,
              }
            )}
            style={{
              background: bg,
            }}
            key={color.name}
            isActive={isActive}
            onClick={() => {
              setColorStyle(color.name)
            }}
          >
            <RadioCardDescription
              style={{
                color: text,
              }}
              className={cn(
                'mb-1 flex items-center justify-between font-medium'
              )}
            >
              {formatThemeName(color.name)}
              <div className="flex gap-1">
                {displayColors.map((color) => (
                  <div
                    key={color}
                    style={{
                      background: color,
                    }}
                    className={cn('h-4 w-4 rounded-full')}
                  />
                ))}
              </div>
            </RadioCardDescription>
            <RadioCardContent
              className="flex flex-col gap-2"
              style={{
                background: bg,
              }}
            ></RadioCardContent>
          </RadioCard>
        )
      })}
    </div>
  )
}
