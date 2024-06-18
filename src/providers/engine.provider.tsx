import { VALID_CHARACTERS_SET } from '@/config/game.config'
import { engineStore } from '@/global-state/game-engine.store'
import { useMetricsStore } from '@/global-state/metrics.store'
import { timerStore, useTimer } from '@/global-state/timer.store'
import { useHasFocus } from '@/hooks/use-has-focus.hook'
import { useCallback, useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

export const EngineProvider = () => {
  const onWindowBlurred = () => {
    setTextAreaFocus(false)
  }
  useHasFocus({
    onBlur: onWindowBlurred,
  })

  const {
    textAreaFocus: hasFocus,
    setTextAreaFocus,
    setCaretPosition,
    userInput,
    setUserInput,
    generateText,
    textString,
  } = engineStore()

  const isRunning = useTimer('isRunning')

  const backspaceHandler = useCallback((userInput: string) => {
    if (!userInput.length) return userInput
    return userInput.slice(0, -1)
  }, [])

  const backspace = () => {
    setUserInput(backspaceHandler(userInput))
  }

  const ctrlBackspace = () => {
    const userInputArr = userInput.split('')
    userInputArr.pop()
    for (let i = userInputArr.length - 1; i >= 0; i--) {
      if (!userInput[i].trim()) break
      userInputArr.pop()
    }
    setUserInput(userInputArr.join(''))
  }

  const handleKeyInput = (e: KeyboardEvent) => {
    if (VALID_CHARACTERS_SET.has(e.key)) {
      const { startTimer, isPaused } = timerStore.getState()
      const userInput = engineStore.getState().userInput

      if (isPaused || !userInput) startTimer()

      setUserInput(userInput + e.key)
    }
  }

  useHotkeys('backspace', backspace, {
    ignoreModifiers: !hasFocus,
  })
  useHotkeys('ctrl+backspace', ctrlBackspace, {
    ignoreModifiers: !hasFocus,
  })

  useHotkeys('*', handleKeyInput, {
    ignoreEventWhen: () => !engineStore.getState().textAreaFocus,
  })

  useEffect(generateText, [generateText])

  useEffect(() => {
    if (!hasFocus && isRunning) return setTextAreaFocus(false)

    if (isRunning) {
      setTextAreaFocus(true)
    }
  }, [hasFocus])

  useEffect(() => {
    const letter = document.getElementById(`letter-${userInput.length}`)
    const newPos = {
      x: letter?.offsetLeft || 0,
      y: letter?.offsetTop || 0,
    }
    setCaretPosition(newPos)
  }, [userInput])

  const { totalTime, hasTimerEnded } = useTimer('totalTime', 'hasTimerEnded')
  const { updateMetrics } = useMetricsStore('updateMetrics')
  useEffect(() => {
    if (!hasTimerEnded) return
    const errorPercentage = getErrorPercentage(userInput, textString)
    const cpm = (userInput.length / totalTime) * 60
    const rawWpm = cpm / 5
    const wpm = rawWpm - (errorPercentage / 100) * rawWpm

    updateMetrics({
      errorPercentage,
      cpm,
      rawWpm,
      wpm,
    })
  }, [hasTimerEnded])

  return <></>
}

const getErrorPercentage = (input: string, trueStr: string) => {
  const total = input.length
  let errors = 0
  for (const i in input.split('')) {
    if (input[i] !== trueStr[i]) {
      errors++
    }
  }
  return (errors * 100) / total
}
