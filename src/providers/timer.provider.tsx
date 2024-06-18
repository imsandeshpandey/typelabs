import { useGameConfig } from '@/atoms/atoms'
import { useTimer } from '@/global-state/timer.store'
import { useEffect } from 'react'

export const TimerProvider = () => {
  const {
    resetTimer,
    hasTimerEnded,
    setHasTimerEnded,
    timeLeft,
    setTotalTime,
  } = useTimer(
    'resetTimer',
    'hasTimerEnded',
    'setHasTimerEnded',
    'timeLeft',
    'setTotalTime'
  )
  const [config] = useGameConfig()

  useEffect(() => {
    if (timeLeft < 0.1) setHasTimerEnded(true)
  }, [timeLeft])

  useEffect(() => {
    hasTimerEnded && resetTimer()
  }, [hasTimerEnded])

  useEffect(() => {
    setTotalTime(config.time)
  }, [config.time])

  return <></>
}
