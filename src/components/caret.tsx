import { cn } from '@/lib/utils'
import { useTimer } from '@/global-state/timer.store'
import { useMemo } from 'react'
import { useEngine } from '@/global-state/game-engine.store'
import { useCaretSmoothness, useCaretStyle, useFontSize } from '@/atoms/atoms'
import { caretSmoothnessValues, caretStyles } from '@/config/caret.config'

export const Caret = (props: { className?: string }) => {
  const [fontSize] = useFontSize()
  const [caretStyle] = useCaretStyle()
  const [caretSmoothness] = useCaretSmoothness()
  const { caretPosition: pos } = useEngine('caretPosition')
  const { isRunning, isPaused } = useTimer('isRunning', 'isPaused')
  const baseStyles = {
    height: fontSize + 8,
  }
  const currentCaretStyle = useMemo(
    () =>
      ({
        [caretStyles.LINE]: {
          width: 2,
        },
        [caretStyles.BLOCK]: {
          width: fontSize / 1.6,
        },
        [caretStyles.BOX]: {
          width: fontSize / 1.6,
          border: '1px solid hsl(var(--caret-color))',
          backgroundColor: 'transparent !important',
        },
        [caretStyles.UNDERLINE]: {
          width: fontSize / 1.6,
          height: 2,
        },
      })[caretStyle],
    [caretStyle, fontSize]
  )
  return (
    <div
      style={{
        top: pos.y,
        left: pos.x,
        transition: `${caretSmoothnessValues[caretSmoothness]}s linear`,
        ...baseStyles,
        ...currentCaretStyle,
      }}
      className={cn(
        'absolute -z-10 -translate-y-full shadow-md',
        caretStyle !== caretStyles.BOX && 'bg-caret',
        (isPaused || !isRunning) && 'animate-blink',
        props.className
      )}
    />
  )
}
