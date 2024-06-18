import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import { getStoreValuesByKeys } from './utils'

export type Metrics = {
  errorPercentage: number
  wpm: number
  rawWpm: number
  cpm: number
}

export type MetricsStore = Metrics & {
  updateMetrics: (metrics: Metrics) => void
}

export const useMetricsStore = <T extends keyof MetricsStore>(...keys: T[]) =>
  metricsStore(useShallow(getStoreValuesByKeys(keys)))

export const metricsStore = create<MetricsStore>((set) => ({
  errorPercentage: 0,
  wpm: 0,
  rawWpm: 0,
  cpm: 0,
  updateMetrics: (metrics: Metrics) => {
    set(metrics)
  },
}))
