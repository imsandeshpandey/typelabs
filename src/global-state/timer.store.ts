import create from 'zustand-store-addons'
import { useShallow } from 'zustand/react/shallow'
import { getStoreValuesByKeys } from './utils'

type TimerStore = {
  interval: NodeJS.Timeout | null
  isRunning: boolean
  isPaused: boolean
  hasTimerEnded: boolean
  totalTime: number
  timeLeft: number
  timeInt: number

  setIsRunning: (bool: boolean) => void
  setIsPaused: (bool: boolean) => void
  setHasTimerEnded: (bool: boolean) => void
  setInterval: (interval: TimerStore['interval']) => void
  setTimeLeft: (time: number, updateBy?: boolean) => void
  setTotalTime: (time: number) => void
  startTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
}

export const useTimer = <T extends keyof TimerStore>(...keys: T[]) =>
  timerStore(useShallow(getStoreValuesByKeys(keys)))

export const timerStore = create<TimerStore>(
  (set) => ({
    totalTime: 0,
    interval: null,
    isPaused: false,
    timeLeft: 0,
    // TODO: Redundant assignment of computed keys. Find a way to get rid of this.
    hasTimerEnded: false,
    isRunning: false,
    timeInt: 0,

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
    setTotalTime: (time: number) => {
      set((state) => ({
        ...state,
        hasTimerEnded: false,
        totalTime: time,
        timeLeft: time,
      }))
    },

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
          timeLeft: state.totalTime,
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
