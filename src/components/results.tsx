import React from 'react'
import { useEngine } from '../providers/engine.provider'
import CountUp from 'react-countup'

export const Results = () => {
  const errorPercentage = useEngine('errorPercentage')
  const wpm = useEngine('wpm')
  const rawWpm = useEngine('rawWpm')

  return (
    <div className="flex flex-col w-full lg:w-[900px] sm:mx-auto gap-2 mb-10 animate-in zoom-in-90">
      <h1 className="font-bold text-lg text-muted-foreground mb-4">Results</h1>
      <div className="flex justify-between w-full gap-10">
        <div className="flex-1">
          <div className="mx-auto w-fit">
            <h3 className="text-sm text-muted-foreground">raw wpm</h3>
            <p className="font-bold text-5xl text-primary">
              <CountUp end={rawWpm >> 0} duration={2} />
            </p>
          </div>
        </div>
        <div className="flex-1">
          <div className="mx-auto w-fit">
            <h3 className="text-sm text-muted-foreground">wpm</h3>
            <p className="font-bold text-5xl text-primary">
              <CountUp end={wpm >> 0} duration={2} />
            </p>
          </div>
        </div>
        <div className="flex-1">
          <div className="mx-auto w-fit">
            <h3 className="text-sm text-muted-foreground">acc</h3>
            <p className="font-bold text-5xl text-primary">
              <CountUp end={100 - errorPercentage} duration={2} />%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
