import { cn } from '@/lib/utils'
import { useTimer } from '@/global-state/timer.store'
import { useMemo } from 'react'
import { useEngine } from '@/global-state/game-engine.store'
import { CaretStyle, useCaretStyle, useFontSize } from '@/atoms/atoms'

export const Caret = (props: { className?: string }) => {
  const [fontSize] = useFontSize()
  const [caretStyle] = useCaretStyle()
  const { caretPosition: pos } = useEngine('caretPosition')
  const { isRunning, isPaused } = useTimer('isRunning', 'isPaused')
  const baseStyles = {
    height: fontSize + 8,
  }
  const currentCaretStyle = useMemo(
    () =>
      ({
        [CaretStyle.LINE]: {
          width: 2,
        },
        [CaretStyle.BLOCK]: {
          width: fontSize / 1.6,
        },
        [CaretStyle.BOX]: {
          width: fontSize / 1.6,
          border: '1px solid hsl(var(--caret-color))',
          backgroundColor: 'transparent !important',
        },
        [CaretStyle.UNDERLINE]: {
          width: fontSize / 1.6,
          height: 2,
        },
      })[CaretStyle.LINE],
    [caretStyle, fontSize]
  )
  return (
    <div
      style={{
        top: pos.y,
        left: pos.x,
        ...baseStyles,
        ...currentCaretStyle,
      }}
      className={cn(
        'absolute -z-10 -translate-y-full shadow-md transition-all',
        caretStyle !== CaretStyle.BOX && 'bg-caret',
        (isPaused || !isRunning) && 'animate-blink',
        props.className
      )}
    />
  )
}
