import React from 'react'
import { useEffect } from 'react'
import create from 'zustand-store-addons'

type TimerStore = {
  interval: NodeJS.Timeout | null
  isRunning: boolean
  isPaused: boolean
  hasTimerEnded: boolean
  currentTotalTime: number
  timeLeft: number
  timeInt: number

  setIsRunning: (bool: boolean) => void
  setIsPaused: (bool: boolean) => void
  setHasTimerEnded: (bool: boolean) => void
  setInterval: (interval: TimerStore['interval']) => void
  setTimeLeft: (time: number, updateBy?: boolean) => void
  setTime: (time: number) => void
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
}

export const useTimer = <K extends keyof TimerStore>(key: K) => {
  return timerStore((s) => s[key])
}

export const timerStore = create<TimerStore>(
  (set) => ({
    currentTotalTime: 0,
    interval: null,
    isPaused: false,
    timeLeft: 0,
    // TODO: Redundant assignment of computed keys. Find a way to get rid of this.
    hasTimerEnded: false,
    isRunning: false,
    timeInt: 0,

    // Setters
    setIsRunning: (bool: boolean) => {
      set((state) => ({ ...state, isRunning: bool }))
    },
    setIsPaused: (bool: boolean) => {
      set((state) => ({ ...state, isPaused: bool }))
    },
    setInterval: (interval: TimerStore['interval']) => {
      set((state) => ({ ...state, interval }))
    },
    setHasTimerEnded: (bool: boolean) => {
      set((state) => ({ ...state, hasTimerEnded: bool }))
    },
    setTimeLeft: (time: number, updateBy?: boolean) => {
      set((s) => ({ ...s, timeLeft: updateBy ? s.timeLeft + time : time }))
    },
    setTime: (time: number) => {
      set((state) => ({
        ...state,
        hasTimerEnded: false,
        currentTotalTime: time,
        timeLeft: time,
      }))
    },
    // Functions
    startTimer: () => {
      set((state) => {
        if (state.interval) clearInterval(state.interval)

        const interval = setInterval(() => state.setTimeLeft(-0.1, true), 100)
        return { ...state, hasTimerEnded: false, interval, isPaused: false }
      })
    },
    pauseTimer: () => {
      set((state) => {
        if (!state.isPaused && state.isRunning) {
          if (state.interval) clearInterval(state.interval)
          return { ...state, isPaused: true, timeLeft: state.timeLeft - 1 }
        }
        return state
      })
    },
    resetTimer: () => {
      set((state) => {
        state.pauseTimer()

        return {
          ...state,
          interval: null,
          isPaused: false,
          timeLeft: state.currentTotalTime,
        }
      })
    },
  }),
  {
    computed: {
      timeInt() {
        return this.timeLeft >> 0
      },
      isRunning() {
        return !!this.interval
      },
    },
  }
)

export const TimerProvider = () => {
  const resetTimer = useTimer('resetTimer')

  const hasTimerEnded = useTimer('hasTimerEnded')
  const setHasTimerEnded = useTimer('setHasTimerEnded')
  const timeLeft = useTimer('timeLeft')

  useEffect(() => {
    if (timeLeft < 0.2) setHasTimerEnded(true)
  }, [timeLeft])

  useEffect(() => {
    hasTimerEnded && resetTimer()
  }, [hasTimerEnded])

  return <></>
}
