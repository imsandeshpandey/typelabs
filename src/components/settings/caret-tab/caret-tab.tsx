import { useCaretSmoothness, useCaretStyle } from '@/atoms/atoms'
import { Setting } from '../setting'
import { RadioCard, RadioCardContent } from '@/components/ui/radio-card'
import {
  CaretStyle,
  DEFAULT_CARET_SMOOTHNESS,
  DEFAULT_CARET_STYLE,
  caretSmoothnessVariants,
  caretStyles,
} from '@/config/caret.config'

export const CaretTab = () => {
  const [caretStyle, setCaretStyle] = useCaretStyle()
  const [caretSmoothness, setCaretSmoothness] = useCaretSmoothness()
  return (
    <div>
      <Setting
        title="Caret Style"
        resetAction={() => setCaretStyle(DEFAULT_CARET_STYLE)}
      >
        <div className="flex items-end gap-4">
          {Object.values(caretStyles).map((style) => {
            return (
              <RadioCard
                isActive={caretStyle === style}
                key={style}
                onClick={() => setCaretStyle(style)}
                className="flex aspect-square h-9 w-7 items-center justify-center"
                tooltipContent={style}
              >
                <RadioCardContent>
                  <CaretStyleVisualizer variant={style} />
                </RadioCardContent>
              </RadioCard>
            )
          })}
        </div>
      </Setting>
      <Setting
        title="Caret Smoothness"
        resetAction={() => setCaretSmoothness(DEFAULT_CARET_SMOOTHNESS)}
      >
        <div className="flex gap-4">
          {Object.values(caretSmoothnessVariants).map((key) => {
            return (
              <RadioCard
                isActive={caretSmoothness === key}
                key={key}
                onClick={() => setCaretSmoothness(key)}
              >
                <RadioCardContent>{key}</RadioCardContent>
              </RadioCard>
            )
          })}
        </div>
      </Setting>
    </div>
  )
}

const caretStyleVariants = {
  [caretStyles.LINE]: 'w-0.5 h-4 bg-caret',
  [caretStyles.UNDERLINE]: 'w-3 h-0.5 bg-caret',
  [caretStyles.BLOCK]: 'w-3 h-4 bg-caret',
  [caretStyles.BOX]: 'w-3 h-4 border border-caret',
}
const CaretStyleVisualizer = (props: { variant: CaretStyle }) => (
  <div className={caretStyleVariants[props.variant]} />
)
