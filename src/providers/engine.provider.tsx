import { ID_TEXT_AREA } from '@/config/ids.config'
import words from '@/config/words.config'
import { useHasFocus } from '@/hooks/use-has-focus.hook'
import { timerStore, useTimer } from '@/providers/timer.provider'
import React from 'react'
import { useCallback, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { OptionsOrDependencyArray } from 'react-hotkeys-hook/dist/types'
import create from 'zustand-store-addons'

export const TIME = 30

const validCharacters =
  '`~1!2@3#4$5%6^7&8*9(0)-_=+qQwWeErRtTyYuUiIoOpP[{]}|aAsSdDfFgGhHjJkKlL;:\'"zZxXcCvVbBnNmM,<.>/? '
const validCharactersSet = new Set(validCharacters.split(''))

type EngineStore = {
  text: string[]
  textString: string
  caretPosition: { x: number; y: number }
  userInput: { total: string; current: string }
  textAreaFocus: boolean
  rawWpm: number
  wpm: number
  errorPercentage: number

  setErrorPercentage: (errorPercentage: number) => void
  setTextAreaFocus: (textAreaFocus: boolean) => void
  setText: (text: EngineStore['text']) => void
  setCaretPosition: (newPos: EngineStore['caretPosition']) => void
  setUserInput: (newPos: EngineStore['userInput']) => void

  restart: () => void
  generateText: () => void
  appendText: () => void
  focusTextArea: () => void
}

export const useEngine = <T extends keyof EngineStore>(key: T) =>
  engineStore((s) => s[key])

export const engineStore = create<EngineStore>(
  (set) => ({
    text: [],
    textString: '',
    caretPosition: { x: 0, y: 0 },
    userInput: { total: '', current: '' },
    textAreaFocus: true,
    rawWpm: 0,
    wpm: 0,
    errorPercentage: 0,
    /********************************************************************/
    setErrorPercentage: (errorPercentage: number) => {
      set((s) => ({ ...s, errorPercentage }))
    },
    setTextAreaFocus: (textAreaFocus: boolean) => {
      timerStore.getState().pauseTimer()
      set((s) => ({ ...s, textAreaFocus }))
    },
    setCaretPosition: (caretPosition: EngineStore['caretPosition']) => {
      set((s) => ({ ...s, caretPosition }))
    },
    setUserInput: (userInput: EngineStore['userInput']) => {
      set((s) => ({ ...s, userInput }))
    },
    setText: (text: EngineStore['text']) => {
      set((s) => ({ ...s, text }))
    },
    /********************************************************************/
    restart: () => {
      engineStore.getState().focusTextArea()
      engineStore.getState().setUserInput({ current: '', total: '' })
      engineStore.getState().setCaretPosition({ x: 0, y: 0 })
      timerStore.getState().resetTimer()
    },
    generateText: () => {
      engineStore.getState().focusTextArea()
      timerStore.getState().setHasTimerEnded(false)
      timerStore.getState().resetTimer()

      const currText = []

      while (currText.length < 45) {
        const index = (Math.random() * (words.length - 1)) >> 0
        currText.push(words[index])
      }

      engineStore.getState().restart()
      engineStore.getState().setText(currText)
    },
    appendText: () => {
      const text = engineStore.getState().text
      const newWords = [...text]

      while (newWords.length < text.length + 45) {
        const index = (Math.random() * words.length - 1) >> 0
        newWords.push(words[index])
      }

      engineStore.getState().setText(newWords)
    },
    focusTextArea: () => document.getElementById(ID_TEXT_AREA)?.focus(),
  }),
  {
    computed: {
      textString() {
        return this.text.join(' ')
      },
    },
  }
)

export const EngineProvider = () => {
  const onWindowBlurred = () => {
    setTextAreaFocus(false)
  }
  useHasFocus({
    onBlur: onWindowBlurred,
  })

  const hasFocus = useEngine('textAreaFocus')
  const setTextAreaFocus = useEngine('setTextAreaFocus')
  const setCaretPosition = useEngine('setCaretPosition')

  const userInput = useEngine('userInput')
  const setUserInput = useEngine('setUserInput')

  const generateText = useEngine('generateText')
  // const restart = useEngine('restart')

  const { isRunning, setTime } = timerStore()

  const backspaceHandler = useCallback((obj: typeof userInput) => {
    if (!obj.current.length) return obj

    return {
      current: obj.current.slice(0, obj.current.length - 1),
      total: obj.total.slice(0, obj.total.length - 1),
    }
  }, [])

  const backspace = () => {
    setUserInput(backspaceHandler({ ...userInput }))
  }

  const ctrlBackspace = () => {
    let copy = backspaceHandler({ ...userInput })
    while (copy.current.at(-1)?.trim()) {
      copy = backspaceHandler(copy)
    }
    setUserInput(copy)
  }

  const handleKeyInput = (e: KeyboardEvent) => {
    if (validCharactersSet.has(e.key)) {
      const startTimer = timerStore.getState().startTimer
      const isPaused = timerStore.getState().isPaused
      const userInput = engineStore.getState().userInput

      if (isPaused || !engineStore.getState().userInput.total) startTimer()

      setUserInput({
        total: userInput.total + e.key,
        current: userInput.current + e.key,
      })
    }
  }

  // EVENT LISTENERS
  const HOTKEY_OPTIONS = {
    ignoreModifiers: !hasFocus,
  } as OptionsOrDependencyArray

  useHotkeys('backspace', backspace, HOTKEY_OPTIONS)
  useHotkeys('ctrl+backspace', ctrlBackspace, HOTKEY_OPTIONS)

  useHotkeys('*', handleKeyInput, {
    ignoreEventWhen: () => !engineStore.getState().textAreaFocus,
  })

  useEffect(() => setTime(TIME), [])
  useEffect(generateText, [generateText])
  useEffect(() => {
    if (!hasFocus && isRunning) return setTextAreaFocus(false)

    if (isRunning) {
      setTextAreaFocus(true)
    }
  }, [hasFocus])

  useEffect(() => {
    const letter = document.getElementById(`letter-${userInput.total.length}`)
    const newPos = {
      x: letter?.offsetLeft || 0,
      y: letter?.offsetTop || 0,
    }
    setCaretPosition(newPos)
  }, [userInput])

  const hasTimerEnded = useTimer('hasTimerEnded')

  useEffect(() => {
    if (!hasTimerEnded) return

    const compareString = (input: string, trueStr: string) => {
      const total = input.length
      let errors = 0
      for (const i in input.split('')) {
        if (input[i] !== trueStr[i]) {
          errors++
        }
      }
      return (errors * 100) / total
    }
    const errorPercentage = compareString(
      engineStore.getState().userInput.total,
      engineStore.getState().textString
    )

    engineStore.setState((s) => {
      const words = s.userInput.total.length / 5

      const rawWpm = (words / TIME) * 60

      const wpm = rawWpm - (errorPercentage / 100) * rawWpm
      return {
        ...s,
        wpm,
        rawWpm,
        errorPercentage,
      }
    })
  }, [hasTimerEnded])

  return <></>
}

// handleKeyInput: (e: KeyboardEvent) => {
//   set((s) => {
//     const startTimer = timerStore.getState().startTimer
//     if (!s.userInput.total) startTimer()

//     const val = e.target.value

//     return {
//       ...s,
//       userInput: {
//         total: s.userInput.total + val,
//         current: s.userInput.current + val,
//       },
//     }
//   })
// }
