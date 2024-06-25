import { cn, formatThemeName } from '@/lib/utils'
import colors from '@/styles/theme-list.json'
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
        const text = color.textColor
        const displayColors = [primary, bg, text]
        const isActive = color.name === colorStyle

        return (
          <RadioCard
            key={color.name}
            isActive={isActive}
            className={cn(
              'col-span-6 flex-grow md:col-span-3',
              isActive && 'outline-primary'
            )}
            onClick={() => {
              setColorStyle(color.name)
            }}
          >
            <RadioCardDescription className="mb-1 flex items-center justify-between font-medium">
              {formatThemeName(color.name)}
              <div className="flex gap-1">
                {displayColors.map((col) => (
                  <div
                    key={col}
                    style={{
                      background: col,
                    }}
                    className="h-4 w-4 rounded-full border border-foreground"
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
