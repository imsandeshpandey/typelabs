import { cn } from '@/lib/utils'
import { useTimer } from '@/global-state/timer.store'
import { useEffect, useRef, useState } from 'react'
import { LINE_HEIGHT } from '@/config/game.config'
import { CursorArrowIcon, ThickArrowUpIcon } from '@radix-ui/react-icons'
import AnimatedGradientText from './compound-ui/animated-gradient-text'
import { Timer } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { useEngine } from '@/global-state/game-engine.store'
import { useGameConfig } from '@/atoms/atoms'

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

    const textAreaHeight = textAreaRef.current?.offsetHeight || Infinity //Total Height of the text
    const caretEffectiveTop = pos.y - scroll //Caret Top Position from the visible text area

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
      <TimeSelector />
      <div
        className={cn(
          `absolute left-1/2 top-1/2 -z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 text-lg text-secondary-foreground/90 opacity-0 transition-all`,
          !focus && 'opacity-100'
        )}
      >
        <CursorArrowIcon className="h-5 w-5" /> Click to return to focus.
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
            <AnimatedGradientText className="m-0 flex items-center">
              <ThickArrowUpIcon className="mr-2 mt-0.5 h-4 w-4 text-muted-foreground" />
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
            'relative z-0 my-4 h-fit max-h-24 select-none overflow-hidden text-muted-foreground/70 transition-[filter] duration-200',
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
                const input = userInput[i]
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

export const TimeSelector = () => {
  const [config, setConfig] = useGameConfig()
  const { isRunning } = useTimer('isRunning')
  if (isRunning) return <div className="h-9" />

  const tabClassNames =
    'rounded-full text-xs dark:data-[state=active]:bg-muted-foreground dark:data-[state=active]:text-background'
  return (
    <div className="group m-auto flex h-9 w-fit items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 pl-4 pr-2 shadow-sm dark:border-none dark:bg-background/40">
      <Timer className="h-4 w-4 text-muted-foreground" />
      <Tabs
        value={`${config.time}`}
        onValueChange={(time) =>
          setConfig((prev) => ({ ...prev, time: +time }))
        }
      >
        <TabsList className="h-fit origin-left rounded-full bg-transparent">
          <TabsTrigger className={tabClassNames} value="15">
            15s
          </TabsTrigger>
          <TabsTrigger className={tabClassNames} value="30">
            30s
          </TabsTrigger>
          <TabsTrigger className={tabClassNames} value="60">
            60s
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

export const Caret = (props: { className?: string }) => {
  const { caretPosition: pos } = useEngine('caretPosition')
  const { isRunning, isPaused } = useTimer('isRunning', 'isPaused')
  return (
    <div className={cn((isPaused || !isRunning) && 'animate-blink')}>
      <div
        style={{
          top: pos.y,
          left: pos.x,
          height: 24,
        }}
        className={cn(
          'absolute z-0 w-[2px] bg-primary transition-all',
          props.className
        )}
      />
    </div>
  )
}

const TimeText = () => {
  const { timeInt } = useTimer('timeInt')
  return <span className="text-2xl text-primary">{timeInt}</span>
}
