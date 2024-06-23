import { ThemeSwitcher } from './theme-switcher'
import { useStyle } from '@/atoms/atoms'
import { ResetButton } from '../../compound-ui/reset-button'
import { BorderRadiusVisualizer } from '../soundpack/border-radius-visualizer'
import {
  BORDER_RADII,
  DEFAULT_BORDER_RADIUS,
  DEFAULT_THEME,
} from '@/config/appearance.config'

export const AppearanceTab = ({
  setBorderRadius,
  borderRadius,
}: {
  setBorderRadius: (radius: number) => void
  borderRadius: number
}) => {
  const [, setStyle] = useStyle()
  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-1 flex items-center text-xl font-bold">
          Radius
          <ResetButton onClick={() => setBorderRadius(DEFAULT_BORDER_RADIUS)} />
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Changes the base border radius of the website.
        </p>
        <div className="flex gap-4">
          {BORDER_RADII.map((radius) => (
            <BorderRadiusVisualizer
              key={radius}
              radius={radius}
              isActive={radius === borderRadius}
              onClick={() => setBorderRadius(radius)}
            />
          ))}
        </div>
      </div>

      <h2 className="mb-4 flex items-center text-xl font-bold">
        Themes
        <ResetButton onClick={() => setStyle(DEFAULT_THEME)} />
      </h2>
      <ThemeSwitcher />
    </div>
  )
}
