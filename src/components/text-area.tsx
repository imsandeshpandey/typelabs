import { cn } from '@/lib/utils'
import { useEngine } from '../providers/engine.provider'
import { useTimer } from '@/providers/timer.provider'
import { useEffect, useRef, useState } from 'react'
import { LINE_HEIGHT } from '@/config/game-constants.config'
import { CursorArrowIcon, ThickArrowUpIcon } from '@radix-ui/react-icons'
import AnimatedGradientText from './compound-ui/animated-gradient-text'
import React from 'react'

export const TextArea = () => {
  const isPaused = useTimer('isPaused')
  const isRunning = useTimer('isRunning')

  const focus = useEngine('textAreaFocus')
  const textString = useEngine('textString')
  const userInput = useEngine('userInput')
  const appendText = useEngine('appendText')
  const pos = useEngine('caretPosition')

  const [scroll, setScroll] = useState(0)
  const [isCaps, setIsCaps] = useState(false)

  const textAreaRef = useRef<HTMLDivElement>(null)

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
    if (pos.y < LINE_HEIGHT) return setScroll(0)

    const textAreaHeight = textAreaRef.current?.offsetHeight || Infinity //TOTAL HEIGHT of the text
    const caretEffectiveTop = pos.y - scroll //CARET TOP POSITION from the visible text area

    const newScroll = pos.y - 3

    if (textAreaHeight - scroll <= 4 * LINE_HEIGHT /*128*/) appendText()
    if (
      caretEffectiveTop >= 2 * LINE_HEIGHT /*64*/ &&
      textAreaHeight - newScroll > LINE_HEIGHT
    ) {
      return setScroll(newScroll - LINE_HEIGHT)
    }

    if (caretEffectiveTop <= LINE_HEIGHT && scroll > 0) {
      return setScroll(scroll - LINE_HEIGHT)
    }
  }, [pos])

  return (
    <div>
      <div
        className={cn(
          `absolute text-lg gap-2 opacity-0 text-secondary-foreground/90 transition-all -z-10 flex items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`,
          !focus && 'opacity-100'
        )}
      >
        <CursorArrowIcon className="h-5 w-5" /> Click to return to focus.
      </div>
      <div
        className={cn(
          'max-h-[25rem] z-10 relative w-full md:max-w-[1200px] mx-auto flex-1 flex flex-col',
          !isPaused && isRunning && 'cursor-none'
        )}
      >
        <div className="flex justify-between w-full">
          <TimeText />
          {isCaps && (
            <AnimatedGradientText className="m-0 flex items-center">
              <ThickArrowUpIcon className="w-4 h-4 mt-0.5 mr-2 text-muted-foreground" />
              <span
                className={cn(
                  `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
                )}
              >
                Capslock on
              </span>
            </AnimatedGradientText>
          )}
        </div>
        <div
          className={cn(
            'relative z-0 my-4 h-fit max-h-24 overflow-hidden transition-[filter] duration-200 text-muted-foreground/70 select-none',
            !focus && 'blur-sm'
          )}
        >
          <div
            style={{
              marginTop: -scroll,
            }}
          >
            <div ref={textAreaRef} className="relative text-xl leading-8">
              <Caret />
              {textString.split('').map((char, i) => {
                const input = userInput.total[i]
                return (
                  <span
                    key={i}
                    id={`letter-${i}`}
                    className={cn('z-10 mx-[0.4px]', {
                      'text-rose-500': input !== char && !!input,
                      'bg-rose-500/50':
                        char === ' ' && char !== input && !!input,
                      'text-foreground': input === char,
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

export const Caret = (props: { className?: string }) => {
  const pos = useEngine('caretPosition')
  const isPaused = useTimer('isPaused')
  const isRunning = useTimer('isRunning')
  return (
    <div className={cn((isPaused || !isRunning) && 'animate-blink')}>
      <div
        style={{
          top: pos.y,
          left: pos.x,
          height: 24,
        }}
        className={cn(
          'z-0 transition-all absolute w-[2px] bg-primary',
          props.className
        )}
      />
    </div>
  )
}

const TimeText = () => {
  const timeInt = useTimer('timeInt')
  return <span className="text-2xl text-primary">{timeInt}</span>
}
