import { useTimer } from '@/providers/timer-provider'
import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { ReactNode } from 'react'

export const GameResponsiveBox = (props: { children: ReactNode }) => {
  const isRunning = useTimer('isRunning')
  return (
    <Slot
      className={cn('opacity-100 transition-opacity', {
        'opacity-0': isRunning,
      })}
    >
      {props.children}
    </Slot>
  )
}
