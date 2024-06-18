import { metricsStore } from '@/global-state/metrics.store'
import CountUp from 'react-countup'

export const Results = () => {
  const { errorPercentage, wpm, rawWpm } = metricsStore()

  return (
    <div className="mb-10 flex w-full flex-col gap-2 animate-in zoom-in-90 sm:mx-auto lg:w-[900px]">
      <h1 className="mb-4 text-lg font-bold text-muted-foreground">Results</h1>
      <div className="flex w-full justify-between gap-10">
        <div className="flex-1">
          <div className="mx-auto w-fit">
            <h3 className="text-sm text-muted-foreground">raw wpm</h3>
            <p className="text-5xl font-bold text-primary">
              <CountUp end={rawWpm >> 0} duration={2} />
            </p>
          </div>
        </div>
        <div className="flex-1">
          <div className="mx-auto w-fit">
            <h3 className="text-sm text-muted-foreground">wpm</h3>
            <p className="text-5xl font-bold text-primary">
              <CountUp end={wpm >> 0} duration={2} />
            </p>
          </div>
        </div>
        <div className="flex-1">
          <div className="mx-auto w-fit">
            <h3 className="text-sm text-muted-foreground">acc</h3>
            <p className="text-5xl font-bold text-primary">
              <CountUp end={100 - errorPercentage} duration={2} />%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
