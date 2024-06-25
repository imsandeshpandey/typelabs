import { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useHasFocus } from '@/hooks/use-has-focus.hook'
import { VALID_CHARACTERS_SET } from '@/config/game.config'
import { engineStore } from '@/global-state/game-engine.store'
import { useMetricsStore } from '@/global-state/metrics.store'
import { timerStore, useTimer } from '@/global-state/timer.store'

export const EngineProvider = () => {
  const {
    textAreaFocus: hasFocus,
    userInput,
    textString,
    setTextAreaFocus,
    setCaretPosition,
    setUserInput,
    generateText,
  } = engineStore()

  const { updateMetrics } = useMetricsStore('updateMetrics')
  const { totalTime, hasTimerEnded, isRunning, startTimer } = useTimer(
    'totalTime',
    'hasTimerEnded',
    'isRunning',
    'startTimer'
  )

  useHasFocus({
    onBlur: () => setTextAreaFocus(false),
  })

  const backspace = () => {
    setUserInput(userInput.slice(0, -1))
  }

  const ctrlBackspace = () => {
    const userInputArr = userInput.split('')
    userInputArr.pop()
    while (userInputArr.at(-1)?.trim()) userInputArr.pop()
    setUserInput(userInputArr.join(''))
  }

  function handleKeyInput(e: KeyboardEvent) {
    if (VALID_CHARACTERS_SET.has(e.key)) {
      const { isPaused } = timerStore.getState()
      const userInput = engineStore.getState().userInput
      if (isPaused || !userInput) startTimer()
      setUserInput(userInput + e.key)
    }
  }

  function updateCaretPosition() {
    const { userInput } = engineStore.getState()
    const letter = document.getElementById(`letter-${userInput.length}`)
    if (!letter) return
    const newPos = {
      x: letter.offsetLeft,
      y: letter.offsetTop + letter.offsetHeight,
    }
    setCaretPosition(newPos)
  }

  const calculateResults = () => {
    if (!hasTimerEnded) return
    const errorPercentage = getErrorPercentage(userInput, textString)
    const cpm = (userInput.length / totalTime) * 60
    const rawWpm = cpm / 5
    const accuracy = 100 - errorPercentage
    const wpm = (accuracy / 100) * rawWpm

    updateMetrics({
      errorPercentage,
      cpm,
      rawWpm,
      wpm,
    })
  }

  useEffect(() => {
    generateText()
    window.addEventListener('resize', updateCaretPosition)
    return () => window.removeEventListener('resize', updateCaretPosition)
  }, [])
  useEffect(() => {
    if (!hasFocus && isRunning) return setTextAreaFocus(false)
    if (isRunning) setTextAreaFocus(true)
  }, [hasFocus])
  useEffect(updateCaretPosition, [userInput, textString])
  useEffect(calculateResults, [hasTimerEnded])

  useHotkeys('backspace', backspace, { ignoreModifiers: !hasFocus })
  useHotkeys('ctrl+backspace', ctrlBackspace, { ignoreModifiers: !hasFocus })
  useHotkeys('*', handleKeyInput, {
    ignoreEventWhen: () => !engineStore.getState().textAreaFocus,
  })

  return <></>
}

const getErrorPercentage = (input: string, trueStr: string) => {
  let errors = 0
  const total = input.length
  for (const i in input.split('')) {
    if (input[i] !== trueStr[i]) errors++
  }
  return (errors * 100) / total
}
