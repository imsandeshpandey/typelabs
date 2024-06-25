import { cn } from '@/lib/utils'
import { useTimer } from '@/global-state/timer.store'
import { useEffect, useRef, useState } from 'react'
import { ThickArrowUpIcon } from '@radix-ui/react-icons'
import { Focus } from 'lucide-react'
import { useEngine } from '@/global-state/game-engine.store'
import { useFontSize } from '@/atoms/atoms'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Caret } from './caret'
import { TimeSelector } from './test-time-selector'

export const TextArea = () => {
  const { isPaused, isRunning } = useTimer('isPaused', 'isRunning')
  const {
    textAreaFocus: focus,
    textString,
    userInput,
    appendText,
    caretPosition: pos,
  } = useEngine(
    'textAreaFocus',
    'textString',
    'userInput',
    'appendText',
    'caretPosition'
  )

  const [capslockRef] = useAutoAnimate()
  const [scroll, setScroll] = useState(0)
  const [isCaps, setIsCaps] = useState(false)

  const textAreaRef = useRef<HTMLDivElement>(null)
  const [fontSize] = useFontSize()
  const lineHeight = fontSize + 16
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      const caps = e.getModifierState('CapsLock')
      setIsCaps(caps)
    }
    document.addEventListener('keydown', handleKeydown)
    return () => removeEventListener('keydown', handleKeydown)
  }, [])

  useEffect(() => {
    // Set scroll to 0 if caret is at the top (When game resets)
    const textAreaHeight = textAreaRef.current?.offsetHeight || Infinity //Total Height of the text
    if (textAreaHeight - scroll <= 4 * lineHeight) appendText()

    if (pos.y < lineHeight) return setScroll(0)

    const caretEffectiveTop = pos.y - scroll //Caret Top Position from the visible text area

    const newScroll = pos.y - 3
    if (
      caretEffectiveTop >= 2 * lineHeight &&
      textAreaHeight - newScroll > lineHeight
    ) {
      return setScroll(newScroll - lineHeight)
    }

    if (caretEffectiveTop <= lineHeight && scroll > 0) {
      return setScroll(scroll - lineHeight)
    }
  }, [pos])
  return (
    <div>
      <TimeSelector />
      <div
        className={cn(
          `absolute left-1/2 top-1/2 -z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 text-lg text-foreground/90 opacity-0 drop-shadow-md transition-all`,
          !focus && 'opacity-100'
        )}
      >
        <Focus className="h-5 w-5" /> Click to return to focus.
      </div>
      <div
        className={cn(
          'relative z-10 mx-auto flex max-h-[25rem] w-full flex-1 flex-col md:max-w-[1200px]',
          !isPaused && isRunning && 'cursor-none'
        )}
      >
        <div className="flex w-full justify-between">
          <TimeText />
          {isCaps && (
            <h3
              ref={capslockRef}
              className="flex items-center gap-1 whitespace-nowrap rounded-md border-2 bg-background px-2 py-1 text-sm animate-out zoom-out-75"
            >
              <ThickArrowUpIcon className="h-4 w-4 text-muted-foreground" />
              Capslock on
            </h3>
          )}
        </div>
        <div
          style={{ maxHeight: 3 * lineHeight }}
          className={cn(
            'relative z-0 my-4 h-fit select-none overflow-hidden text-sub transition-[filter] duration-200',
            !focus && 'blur-sm'
          )}
        >
          <div
            style={{
              marginTop: -scroll,
            }}
          >
            <div
              ref={textAreaRef}
              className="relative -z-10"
              style={{
                fontSize: fontSize,
                lineHeight: lineHeight + 'px',
              }}
            >
              <Caret />
              {textString.split('').map((char, i) => {
                const id = `letter-${i}`
                const input = userInput[i]
                const textError = input !== char && !!input
                const spaceError = char === ' ' && char !== input && !!input
                const correct = input === char
                return (
                  <span
                    key={i}
                    id={id}
                    className={cn('z-10', {
                      'text-error': textError,
                      'bg-error/50': spaceError,
                      'text-foreground': correct,
                    })}
                  >
                    {char}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const TimeText = () => {
  const { timeInt } = useTimer('timeInt')
  return <p className="text-2xl text-primary">{timeInt}</p>
}
